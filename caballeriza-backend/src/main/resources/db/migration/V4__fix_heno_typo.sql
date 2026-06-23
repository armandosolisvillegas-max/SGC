UPDATE insumos SET nombre = REPLACE(nombre, 'Hueno', 'Heno') WHERE nombre LIKE '%Hueno%';
UPDATE insumos SET nombre = REPLACE(nombre, 'hueno', 'heno') WHERE nombre LIKE '%hueno%';
