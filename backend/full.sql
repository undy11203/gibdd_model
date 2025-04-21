-- Insert statements for Accident table
INSERT INTO accident (date, location, type, description, victims_count, damage_amount, cause, road_conditions) VALUES
('2023-01-01', ST_GeomFromText('POINT(55.7558 37.6173)', 4326), 'COLLISION', 'Two-car collision', 2, 5000.00, 'Careless driving', 'Dry'),
('2023-02-15', ST_GeomFromText('POINT(59.9343 30.3351)', 4326), 'OVERTURNING', 'Rolled over', 1, 3000.00, 'Speeding', 'Wet');

-- Insert statements for AccidentParticipant table
INSERT INTO accident_participants (accident_id, vehicle_id, role) VALUES
(1, 1, 'DRIVER'),
(1, 2, 'PASSENGER'),
(2, 2, 'DRIVER');

-- Insert statements for AlarmSystem table
INSERT INTO alarm_system (name, reliability) VALUES
('Basic Alarm', 'LOW'),
('Advanced Alarm', 'HIGH');

-- Insert statements for Brand table
INSERT INTO brand (name, theft_popularity) VALUES
('Toyota', 'LOW'),
('BMW', 'HIGH');

-- Insert statements for LicensePlate table
INSERT INTO license_plate (license_number, number, series, status, date) VALUES
('А123БС', 123, 'А', true, '2023-01-01'),
('В456ДЕ', 456, 'В', false, '2023-02-15');

-- Insert statements for Organization table
INSERT INTO organization (name, district, address, director) VALUES
('Auto Repair Shop', 'Central', '123 Main St', 'John Doe'),
('Car Dealership', 'North', '456 Elm St', 'Jane Smith');

-- Insert statements for Owner table
INSERT INTO owner (full_name, address, phone) VALUES
('Alice Johnson', '789 Oak St', '123-456-7890'),
('Bob Brown', '321 Pine St', '987-654-3210');

-- Insert statements for SalePurchase table
INSERT INTO sales_purchases (vehicle_id, date, cost, buyer_id, seller_id) VALUES
(1, '2023-01-01', 15000.00, 1, 2),
(2, '2023-02-15', 20000.00, 2, 1);

-- Insert statements for TechnicalInspection table
INSERT INTO technical_inspection (vehicle_id, inspection_date, result, next_inspection_date) VALUES
(1, '2023-01-01', 'Passed', '2024-01-01'),
(2, '2023-02-15', 'Failed', '2023-03-15');

-- Insert statements for Theft table
INSERT INTO thefts (vehicle_id, theft_date, location, description) VALUES
(1, '2023-01-01', ST_GeomFromText('POINT(55.7558 37.6173)', 4326), 'Stolen from parking lot'),
(2, '2023-02-15', ST_GeomFromText('POINT(59.9343 30.3351)', 4326), 'Stolen from driveway');

-- Insert statements for Vehicle table
INSERT INTO vehicle (brand_id, release_date, engine_volume, engine_number, chassis_number, body_number, color, vehicle_type, license_plate_id, owner_id, organization_id, alarm_system_id) VALUES
(1, '2022-01-01 00:00:00', 2.0, 'ENG123456', 'CHS123456', 'BOD123456', 'Red', 'SEDAN', 1, 1, 1, 1),
(2, '2023-02-15 00:00:00', 2.5, 'ENG654321', 'CHS654321', 'BOD654321', 'Blue', 'SUV', 2, 2, 2, 2);

-- Insert statements for WantedVehicle table
INSERT INTO wanted_vehicles (vehicle_id, added_date, reason, status) VALUES
(1, '2023-01-01', 'Stolen', 'ACTIVE'),
(2, '2023-02-15', 'Damaged', 'INACTIVE');
