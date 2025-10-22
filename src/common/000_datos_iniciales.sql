-- ===== Reset de secuencias (solo si existen) =====
ALTER SEQUENCE IF EXISTS cliente_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tipo_producto_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS producto_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS estado_venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS detalle_venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS pagos_id_seq RESTART WITH 1;

-- ===== ROLES =====
INSERT INTO roles (nombre) VALUES
('User'),
('Owner'),
('Admin');

-- ===== CLIENTES =====
INSERT INTO cliente (nombre, apellido, telefono, correo_electronico, contraseña, fecha_alta)
VALUES
('Juan', 'Pérez', '1122334455', 'juan.perez@test.com', 'hashedpass123', CURRENT_DATE),
('María', 'Gómez', '1199887766', 'maria.gomez@test.com', 'hashedpass456', CURRENT_DATE);

-- ===== TIPOS DE PRODUCTO =====
INSERT INTO tipo_producto (nombre)
VALUES
('Paletas'),
('Pelotas'),
('Muñequeras'),
('Rodilleras'),
('Gorras');

-- ===== PRODUCTOS =====
INSERT INTO producto (tipo_producto, nombre, descripcion, price, stock, es_activo)
VALUES
(1, 'Paleta Adidas Metalbone 3.3', 'Paleta de pádel Adidas Metalbone 3.3 de alto rendimiento', 95000, 10, true),
(1, 'Paleta Bullpadel Vertex 03 Comfort', 'Paleta Bullpadel Vertex 03 Comfort, potencia y control', 85000, 12, true),
(1, 'Paleta Nox AT10', 'Paleta Nox AT10 diseñada junto a Agustín Tapia', 90000, 8, true),
(2, 'Pelotas ODEA x3', 'Pack de 3 pelotas ODEA para pádel', 7000, 40, true),
(2, 'Pelotas NOX x3', 'Pack de 3 pelotas NOX para pádel', 7500, 35, true),
(3, 'Muñequera Adidas', 'Muñequera absorbente Adidas para pádel', 2500, 50, true),
(4, 'Rodillera Marca', 'Rodillera elástica de soporte deportivo', 6000, 20, true),
(3, 'Muñequeras Bullpadel', 'Pack de muñequeras Bullpadel', 3000, 40, true),
(5, 'Gorra Bullpadel', 'Gorra deportiva Bullpadel', 5000, 25, true),
(5, 'Gorra Nox', 'Gorra deportiva Nox', 5200, 25, true);

-- ===== IMAGENES =====
INSERT INTO imagenes (producto_id, url, nombre_archivo, tamaño)
VALUES
(1, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/1/Paleta-Adidas-Metalbone3.3-3.jpg', 'Paleta-Adidas-Metalbone3.3-1.jpg', '35KB'),
(1, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/1/Paleta-Adidas-Metalbone3.3-2.jpg', 'Paleta-Adidas-Metalbone3.3-2.jpg', '140KB'),
(1, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/1/Paleta-Adidas-Metalbone3.3-1.jpg', 'Paleta-Adidas-Metalbone3.3-3.jpg', '62KB'),
(2, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/2/Paleta-Bullpadel-Vertex03Comfort-1.jpg', 'Paleta-Bullpadel-Vertex03Comfort-1.jpg', '79KB'),
(2, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/2/Paleta-Bullpadel-Vertex03Comfort-2.jpg', 'Paleta-Bullpadel-Vertex03Comfort-2.jpg', '286KB'),
(3, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/3/Paleta-Nox-AT10-1.jpg', 'Paleta-Nox-AT10-1.jpg', '56KB'),
(3, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/3/Paleta-Nox-AT10-2.jpg', 'Paleta-Nox-AT10-2.jpg', '77KB'),
(4, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/4/Pelota-ODEA-1.webp', 'Pelota-ODEA-1.webp', '40KB'),
(4, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/4/Pelota-ODEA-2.webp', 'Pelota-ODEA-2.webp', '13KB'),
(4, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/4/Pelota-ODEA-3.webp', 'Pelota-ODEA-3.webp', '26KB'),
(5, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/5/Pelota-NOX-1.webp', 'Pelota-NOX-1.webp', '22KB'),
(5, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/5/Pelota-NOX-2.webp', 'Pelota-NOX-2.webp', '22KB'),
(6, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/6/Munequera-ADIDAS-1.jpg', 'Munequera-ADIDAS-1.jpg', '22KB'),
(6, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/6/Munequera-ADIDAS-2.jpg', 'Munequera-ADIDAS-2.jpg', '22KB'),
(7, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/7/Rodillera-Marca-1.webp', 'Rodillera-Marca-1.webp', '10KB'),
(8, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/8/Munequera-BULLPADEL-1.webp', 'Munequera-BULLPADEL-1.webp', '22KB'),
(8, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/8/Munequera-BULLPADEL-2.webp', 'Munequera-BULLPADEL-2.webp', '22KB'),
(9, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/9/Gorra-BULLPADEL-1.jpg', 'Gorra-BULLPADEL-1.jpg', '22KB'),
(9, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/9/Gorra-BULLPADEL-2.webp', 'Gorra-BULLPADEL-2.webp', '22KB'),
(10, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/10/Gorra-NOX-1.webp', 'Gorra-NOX-1.webp', '22KB'),
(10, 'https://hodcwckiqgtejtxpdyzm.supabase.co/storage/v1/object/public/images-testing/products/10/Gorra-NOX-2.webp', 'Gorra-NOX-2.webp', '22KB');


-- ===== ESTADOS DE VENTA =====
INSERT INTO estado_venta (valor)
VALUES
('Aprobado'),
('Pendiente'),
('Rechazado'),
('Devuelto'),
('Cancelado');

-- ===== VENTAS =====
INSERT INTO venta (fecha_venta, cliente_id, pago_id, total, estado_venta_id)
VALUES
-- Juan compra Paleta Adidas
(CURRENT_DATE, 1, NULL, 95000, 1),
-- María compra Muñequeras Bullpadel
(CURRENT_DATE, 2, NULL, 3000, 1),
-- Juan compra Pelotas ODEA
(CURRENT_DATE, 1, NULL, 7000, 1),
-- María compra Gorra Nox
(CURRENT_DATE, 2, NULL, 5200, 2),
-- Juan compra Paleta Nox AT10 + Muñequera Adidas
(CURRENT_DATE, 1, NULL, 92500, 1),
-- María compra Paleta Bullpadel
(CURRENT_DATE, 2, NULL, 85000, 3),
-- Juan compra Gorra Bullpadel + Pelotas NOX
(CURRENT_DATE, 1, NULL, 12500, 1);

-- ===== DETALLE DE VENTA =====
-- ===== DETALLE DE VENTA =====
INSERT INTO detalle_venta (venta, producto, cantidad, total_detalle)
VALUES
-- Venta 1: Juan compra Paleta Adidas
(1, 1, 1, 95000),
-- Venta 2: María compra Muñequeras Bullpadel
(2, 8, 1, 3000),
-- Venta 3: Juan compra Pelotas ODEA
(3, 4, 1, 7000),
-- Venta 4: María compra Gorra Nox
(4, 10, 1, 5200),
-- Venta 5: Juan compra Paleta Nox AT10 + Muñequera Adidas
(5, 3, 1, 90000),
(5, 6, 1, 2500),
-- Venta 6: María compra Paleta Bullpadel
(6, 2, 1, 85000),
-- Venta 7: Juan compra Gorra Bullpadel + Pelotas NOX
(7, 9, 1, 5000),
(7, 5, 1, 7500);
