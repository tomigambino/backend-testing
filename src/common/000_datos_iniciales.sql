-- ===== Reset de secuencias (solo si existen) =====
ALTER SEQUENCE IF EXISTS cliente_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tipo_producto_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS producto_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS estado_venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS detalle_venta_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS pagos_id_seq RESTART WITH 1;

-- ===== CLIENTES =====
INSERT INTO cliente (nombre, apellido, telefono, correo_electronico, contraseña, fecha_alta)
VALUES
('Juan', 'Pérez', '1122334455', 'juan.perez@test.com', 'hashedpass123', CURRENT_DATE),
('María', 'Gómez', '1199887766', 'maria.gomez@test.com', 'hashedpass456', CURRENT_DATE);

-- ===== TIPOS DE PRODUCTO =====
INSERT INTO tipo_producto (nombre)
VALUES
('Alquiler de Cancha'),
('Accesorios');

-- ===== PRODUCTOS =====
-- Ahora usando la columna booleana correcta: es_activo
INSERT INTO producto (tipo_producto, nombre, descripcion, price, stock, es_activo)
VALUES
(1, 'Alquiler Cancha Fútbol 5', 'Alquiler por 1 hora', 5000, 10, true),
(2, 'Pelota Profesional', 'Pelota N°5 de fútbol sintético', 15000, 20, true);

-- ===== ESTADOS DE VENTA =====
INSERT INTO estado_venta (valor)
VALUES
('Aprobado'),
('Pendiente'),
('Rechazado'),
('Devuelto'),
('Cancelado');

-- ===== PAGOS =====
-- Solo funcionará si la tabla 'pagos' ya existe (migraciones corridas)
--INSERT INTO pagos (referencia_mp_id, init_point_mp_id, payment_method_mp_id, state_mp_id, monto, fecha_creacion, fecha_aprobacion)
--VALUES
--('PREF-TEST-001', 'https://www.mercadopago.com/init_point_test1', NULL, 'pending', 5000, NOW(), NULL),
--('PREF-TEST-002', 'https://www.mercadopago.com/init_point_test2', NULL, 'pending', 15000, NOW(), NULL),
--('123456', 'https://www.mercadopago.com/init_point_test3', NULL, 'pending', 5000, NOW(), NOW());

-- ===== VENTAS =====
INSERT INTO venta (fecha_venta, cliente_id, pago_id, seña, total, descuento_aplicado, estado_venta_id, fecha_entrega_aproximada)
VALUES
(CURRENT_DATE, 1, NULL, 1000, 5000, 0, 1, CURRENT_DATE + INTERVAL '1 day'),
(CURRENT_DATE, 2, NULL, 2000, 15000, 10, 1, CURRENT_DATE + INTERVAL '3 days');

-- ===== DETALLE DE VENTA =====
INSERT INTO detalle_venta (venta, producto, cantidad, color, total_detalle)
VALUES
(1, 1, 1, 'N/A', 5000),
(2, 2, 1, 'Blanco', 15000);


