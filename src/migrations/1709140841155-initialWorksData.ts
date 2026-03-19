const { MigrationInterface, QueryRunner } = require("typeorm");
const { Logger } = require('@nestjs/common');
const fs = require('fs');
const path = require('path');

class InitialWorksData1709140841155 {
    async up(queryRunner) {
        const logger = new Logger();

        // ruta al archivo seed
        const filePath = path.join(__dirname, 'initialWorks.json');

        // crea la tabla si no existe
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS section (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description VARCHAR(255),
                name VARCHAR(255),
                vehicle VARCHAR(255)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS work (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description VARCHAR(255),
                name VARCHAR(255),
                price1 DECIMAL,
                price2 DECIMAL,
                price3 DECIMAL,
                price4 DECIMAL,
                priceGapMod DECIMAL,
                sectionId INT,
                budgetId INT
            )
        `);

        // Leer el archivo JSON
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);

        try {

            const sectionIdMap = new Map();
            let sectionIdCounter = 1;

            // Recorrer los datos y mapear las secciones sin repetición
            data.forEach(entry => {
                const sectionKey = `${entry.section.description}_${entry.section.name}_${entry.section.vehicle}`;
                if (!sectionIdMap.has(sectionKey)) {
                    sectionIdMap.set(sectionKey, sectionIdCounter++);
                }
            });

            // Insertar las secciones en la tabla
            for (const [sectionKey, sectionId] of sectionIdMap.entries()) {
                const [description, name, vehicle] = sectionKey.split('_');
                await queryRunner.query(`
                    INSERT INTO section (id, description, name, vehicle)
                    VALUES (${sectionId}, '${description}', '${name}', '${vehicle}')
                `);
            }

            logger.log("Secciones cargadas correctamente en la base de datos.");

            // Insertar los trabajos en la tabla work
            const workValues = data.map(entry => `(
                '${entry.description}', 
                '${entry.name}', 
                ${entry.price1}, 
                ${entry.price2}, 
                ${entry.price3}, 
                ${entry.price4}, 
                ${entry.priceGapMod}, 
                ${sectionIdMap.get(`${entry.section.description}_${entry.section.name}_${entry.section.vehicle}`)}
            )`).join(', ');

            await queryRunner.query(`
                INSERT INTO work (description, name, price1, price2, price3, price4, priceGapMod, sectionId)
                VALUES ${workValues};
            `);

            logger.log("Datos insertados correctamente en la base de datos.");
        } catch (error) {
            logger.error("Error al cargar los datos iniciales:", error);
        }
    }

    async down(queryRunner) {
        const logger = new Logger();

        // Verificar si hay trabajos asociados a alguna sección
        const hasWorks = await queryRunner.query(`
            SELECT COUNT(*) AS count FROM work WHERE sectionId IN (
                SELECT DISTINCT sectionId FROM work
            )
        `);

        const worksCount = hasWorks[0].count;

        if (worksCount > 0) {
            logger.warn("Hay trabajos asociados a secciones. No se puede revertir la migración.");
            return;
        }
/*---------------------------------ESTO NO BORRA----------------------------------*/

        // Si no hay trabajos asociados, eliminar todos los registros y la tabla work
        await queryRunner.query(`DELETE FROM work`);
        await queryRunner.query(`DROP TABLE IF EXISTS work`);

        logger.log("Datos iniciales revertidos correctamente.");
    }
}

module.exports = InitialWorksData1709140841155;
