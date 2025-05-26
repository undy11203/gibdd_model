-- Triggers for updating Brand theft popularity and AlarmSystem reliability

-- Create a function to update Brand theft popularity
CREATE OR REPLACE FUNCTION update_brand_theft_popularity()
RETURNS TRIGGER AS $$
DECLARE
brand_id BIGINT;
    theft_count BIGINT;
    total_vehicles BIGINT;
    theft_percentage FLOAT;
BEGIN
    -- Get the brand_id of the vehicle being added to wanted list
SELECT v.brand_id INTO brand_id
FROM vehicle v
WHERE v.id = NEW.vehicle_id;

-- Only proceed if we have a valid brand_id
IF brand_id IS NOT NULL THEN
        -- Count the number of thefts for this brand
SELECT COUNT(*) INTO theft_count
FROM wanted_vehicles wv
         JOIN vehicle v ON wv.vehicle_id = v.id
WHERE v.brand_id = brand_id
  AND (wv.reason ILIKE '%theft%' OR wv.reason ILIKE '%stolen%' OR wv.reason ILIKE '%угон%' OR wv.reason ILIKE '%кража%')
  AND wv.status = 'WANTED';

-- Count the total number of vehicles for this brand
SELECT COUNT(*) INTO total_vehicles
FROM vehicle v
WHERE v.brand_id = brand_id;

-- Calculate theft percentage
IF total_vehicles > 0 THEN
            theft_percentage := (theft_count::FLOAT / total_vehicles::FLOAT) * 100;
ELSE
            theft_percentage := 0;
END IF;
        
        -- Update the brand's theft popularity based on the percentage
        IF theft_percentage >= 5 THEN
UPDATE brand SET theft_popularity = 'HIGH' WHERE id = brand_id;
ELSIF theft_percentage >= 2 THEN
UPDATE brand SET theft_popularity = 'MEDIUM' WHERE id = brand_id;
ELSE
UPDATE brand SET theft_popularity = 'LOW' WHERE id = brand_id;
END IF;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brand_theft_popularity_trigger') THEN
DROP TRIGGER update_brand_theft_popularity_trigger ON wanted_vehicles;
END IF;
END $$;

-- Create a trigger to update Brand theft popularity when a vehicle is added to wanted list
CREATE TRIGGER update_brand_theft_popularity_trigger
    AFTER INSERT OR UPDATE ON wanted_vehicles
                        FOR EACH ROW
                        WHEN (NEW.reason ILIKE '%theft%' OR NEW.reason ILIKE '%stolen%' OR NEW.reason ILIKE '%угон%' OR NEW.reason ILIKE '%кража%')
                        EXECUTE FUNCTION update_brand_theft_popularity();

-- Create a function to update AlarmSystem reliability
CREATE OR REPLACE FUNCTION update_alarm_system_reliability()
RETURNS TRIGGER AS $$
DECLARE
alarm_system_id BIGINT;
    theft_count BIGINT;
    total_vehicles BIGINT;
    theft_percentage FLOAT;
BEGIN
    -- Get the alarm_system_id of the vehicle being added to wanted list
SELECT v.alarm_system_id INTO alarm_system_id
FROM vehicle v
WHERE v.id = NEW.vehicle_id;

-- Only proceed if we have a valid alarm_system_id
IF alarm_system_id IS NOT NULL THEN
        -- Count the number of thefts for vehicles with this alarm system
SELECT COUNT(*) INTO theft_count
FROM wanted_vehicles wv
         JOIN vehicle v ON wv.vehicle_id = v.id
WHERE v.alarm_system_id = alarm_system_id
  AND (wv.reason ILIKE '%theft%' OR wv.reason ILIKE '%stolen%' OR wv.reason ILIKE '%угон%' OR wv.reason ILIKE '%кража%')
  AND wv.status = 'WANTED';

-- Count the total number of vehicles with this alarm system
SELECT COUNT(*) INTO total_vehicles
FROM vehicle v
WHERE v.alarm_system_id = alarm_system_id;

-- Calculate theft percentage
IF total_vehicles > 0 THEN
            theft_percentage := (theft_count::FLOAT / total_vehicles::FLOAT) * 100;
ELSE
            theft_percentage := 0;
END IF;

        -- Update the alarm system's reliability based on the percentage
        IF theft_percentage >= 5 THEN
UPDATE alarm_system SET reliability = 'LOW' WHERE id = alarm_system_id;
ELSIF theft_percentage >= 2 THEN
UPDATE alarm_system SET reliability = 'MEDIUM' WHERE id = alarm_system_id;
ELSE
UPDATE alarm_system SET reliability = 'HIGH' WHERE id = alarm_system_id;
END IF;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_alarm_system_reliability_trigger') THEN
DROP TRIGGER update_alarm_system_reliability_trigger ON wanted_vehicles;
END IF;
END $$;

-- Create a trigger to update AlarmSystem reliability when a vehicle is added to wanted list
CREATE TRIGGER update_alarm_system_reliability_trigger
    AFTER INSERT OR UPDATE ON wanted_vehicles
                        FOR EACH ROW
                        WHEN (NEW.reason ILIKE '%theft%' OR NEW.reason ILIKE '%stolen%' OR NEW.reason ILIKE '%угон%' OR NEW.reason ILIKE '%кража%')
                        EXECUTE FUNCTION update_alarm_system_reliability();

-- Create a function to update Brand theft popularity when a vehicle is removed from wanted list
CREATE OR REPLACE FUNCTION update_brand_theft_popularity_on_found()
RETURNS TRIGGER AS $$
DECLARE
brand_id BIGINT;
    theft_count BIGINT;
    total_vehicles BIGINT;
    theft_percentage FLOAT;
BEGIN
    -- Get the brand_id of the vehicle being removed from wanted list
SELECT v.brand_id INTO brand_id
FROM vehicle v
WHERE v.id = NEW.vehicle_id;

-- Only proceed if we have a valid brand_id and the status changed to FOUND
IF brand_id IS NOT NULL AND NEW.status = 'FOUND' AND OLD.status = 'WANTED' THEN
        -- Count the number of thefts for this brand
SELECT COUNT(*) INTO theft_count
FROM wanted_vehicles wv
         JOIN vehicle v ON wv.vehicle_id = v.id
WHERE v.brand_id = brand_id
  AND (wv.reason ILIKE '%theft%' OR wv.reason ILIKE '%stolen%' OR wv.reason ILIKE '%угон%' OR wv.reason ILIKE '%кража%')
  AND wv.status = 'WANTED';

-- Count the total number of vehicles for this brand
SELECT COUNT(*) INTO total_vehicles
FROM vehicle v
WHERE v.brand_id = brand_id;

-- Calculate theft percentage
IF total_vehicles > 0 THEN
            theft_percentage := (theft_count::FLOAT / total_vehicles::FLOAT) * 100;
ELSE
            theft_percentage := 0;
END IF;

        -- Update the brand's theft popularity based on the percentage
        IF theft_percentage >= 5 THEN
UPDATE brand SET theft_popularity = 'HIGH' WHERE id = brand_id;
ELSIF theft_percentage >= 2 THEN
UPDATE brand SET theft_popularity = 'MEDIUM' WHERE id = brand_id;
ELSE
UPDATE brand SET theft_popularity = 'LOW' WHERE id = brand_id;
END IF;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brand_theft_popularity_on_found_trigger') THEN
DROP TRIGGER update_brand_theft_popularity_on_found_trigger ON wanted_vehicles;
END IF;
END $$;

-- Create a trigger to update Brand theft popularity when a vehicle is removed from wanted list
CREATE TRIGGER update_brand_theft_popularity_on_found_trigger
    AFTER UPDATE ON wanted_vehicles
    FOR EACH ROW
    WHEN (NEW.status = 'FOUND' AND OLD.status = 'WANTED')
    EXECUTE FUNCTION update_brand_theft_popularity_on_found();

-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_alarm_system_reliability_on_found_trigger') THEN
DROP TRIGGER update_alarm_system_reliability_on_found_trigger ON wanted_vehicles;
END IF;
END $$;

-- Create a trigger to update AlarmSystem reliability when a vehicle is removed from wanted list
CREATE TRIGGER update_alarm_system_reliability_on_found_trigger
    AFTER UPDATE ON wanted_vehicles
    FOR EACH ROW
    WHEN (NEW.status = 'FOUND' AND OLD.status = 'WANTED')
    EXECUTE FUNCTION update_alarm_system_reliability_on_found();