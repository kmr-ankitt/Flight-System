-- Airports table creation
CREATE TABLE Airports (
    airport_id SERIAL PRIMARY KEY,
    airport_code VARCHAR(3) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL
);

-- Flights table creation
CREATE TABLE Flights (
    flight_id SERIAL PRIMARY KEY,
    flight_code VARCHAR(10) NOT NULL,
    source_airport_id INTEGER NOT NULL,
    destination_airport_id INTEGER NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
    FOREIGN KEY (source_airport_id) REFERENCES Airports(airport_id),
    FOREIGN KEY (destination_airport_id) REFERENCES Airports(airport_id)
);

-- Bookings table creation
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    flight_id INTEGER NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(15),
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);

-- Airports table dummy data insertion
INSERT INTO Airports (airport_id, airport_code, airport_name, city) VALUES
(22, 'JFK', 'John F. Kennedy International', 'New York'),
(23, 'LAX', 'Los Angeles International', 'Los Angeles'),
(24, 'ORD', 'O''Hare International', 'Chicago'),
(25, 'MIA', 'Miami International', 'Miami'),
(26, 'ATL', 'Hartsfield-Jackson Atlanta International', 'Atlanta'),
(27, 'DFW', 'Dallas/Fort Worth International', 'Dallas'),
(28, 'SFO', 'San Francisco International', 'San Francisco'),
(29, 'SEA', 'Seattle-Tacoma International', 'Seattle'),
(30, 'DEN', 'Denver International', 'Denver'),
(31, 'BOS', 'Logan International', 'Boston'),
(32, 'PHX', 'Phoenix Sky Harbor International', 'Phoenix'),
(33, 'IAH', 'George Bush Intercontinental', 'Houston'),
(34, 'LAS', 'Harry Reid International', 'Las Vegas'),
(35, 'CLT', 'Charlotte Douglas International', 'Charlotte'),
(36, 'EWR', 'Newark Liberty International', 'Newark'),
(37, 'MSP', 'Minneapolis-Saint Paul International', 'Minneapolis'),
(38, 'DTW', 'Detroit Metropolitan', 'Detroit'),
(39, 'SLC', 'Salt Lake City International', 'Salt Lake City'),
(40, 'BWI', 'Baltimore/Washington International', 'Baltimore'),
(41, 'SAN', 'San Diego International', 'San Diego')
ON CONFLICT (airport_id) DO UPDATE SET
    airport_code = EXCLUDED.airport_code,
    airport_name = EXCLUDED.airport_name,
    city = EXCLUDED.city;

-- FLights table dummy data insertion
INSERT INTO Flights (flight_code, source_airport_id, destination_airport_id, departure_time, arrival_time, seats_available) VALUES
('AA123', 22, 23, '2025-03-26 08:00:00', '2025-03-26 11:30:00', 50),  -- JFK to LAX
('UA456', 23, 24, '2025-03-26 14:00:00', '2025-03-26 16:00:00', 30),  -- LAX to ORD
('DL789', 24, 25, '2025-03-26 09:00:00', '2025-03-26 12:00:00', 40),  -- ORD to MIA
('WN101', 26, 27, '2025-03-26 10:00:00', '2025-03-26 12:30:00', 60), -- ATL to DFW
('AA202', 28, 29, '2025-03-26 12:00:00', '2025-03-26 13:30:00', 45), -- SFO to SEA
('UA303', 30, 31, '2025-03-26 15:00:00', '2025-03-26 17:00:00', 35), -- DEN to BOS
('DL404', 32, 33, '2025-03-26 07:00:00', '2025-03-26 09:00:00', 25), -- PHX to IAH
('WN505', 34, 35, '2025-03-26 11:00:00', '2025-03-26 12:30:00', 55), -- LAS to CLT
('AA606', 36, 22, '2025-03-26 13:00:00', '2025-03-26 14:00:00', 40), -- EWR to JFK
('UA707', 37, 26, '2025-03-26 16:00:00', '2025-03-26 18:30:00', 30), -- MSP to ATL
('DL808', 39, 40, '2025-03-26 09:30:00', '2025-03-26 11:00:00', 50), -- SLC to BWI
('WN909', 41, 23, '2025-03-26 14:30:00', '2025-03-26 17:30:00', 45), -- SAN to LAX
('AA111', 22, 26, '2025-03-26 17:00:00', '2025-03-26 19:30:00', 35), -- JFK to ATL
('UA222', 23, 28, '2025-03-26 08:30:00', '2025-03-26 10:00:00', 60), -- LAX to SFO
('DL333', 24, 30, '2025-03-26 12:30:00', '2025-03-26 14:30:00', 40), -- ORD to DEN
('WN444', 25, 32, '2025-03-26 15:30:00', '2025-03-26 18:00:00', 50), -- MIA to PHX
('AA555', 27, 34, '2025-03-26 10:30:00', '2025-03-26 13:00:00', 30), -- DFW to LAS
('UA666', 29, 36, '2025-03-26 13:30:00', '2025-03-26 16:00:00', 45), -- SEA to EWR
('DL777', 31, 37, '2025-03-26 09:00:00', '2025-03-26 11:30:00', 25), -- BOS to MSP
('WN888', 33, 39, '2025-03-26 11:30:00', '2025-03-26 13:30:00', 55), -- IAH to SLC
('AA999', 35, 41, '2025-03-26 14:00:00', '2025-03-26 16:30:00', 40), -- CLT to SAN
('UA121', 22, 24, '2025-03-27 07:00:00', '2025-03-27 09:00:00', 50), -- JFK to ORD
('DL232', 23, 25, '2025-03-27 10:00:00', '2025-03-27 13:30:00', 35), -- LAX to MIA
('WN343', 26, 28, '2025-03-27 12:00:00', '2025-03-27 15:00:00', 60), -- ATL to SFO
('AA454', 27, 29, '2025-03-27 15:00:00', '2025-03-27 17:30:00', 45), -- DFW to SEA
('UA565', 30, 32, '2025-03-27 08:00:00', '2025-03-27 10:00:00', 30), -- DEN to PHX
('DL676', 31, 33, '2025-03-27 11:00:00', '2025-03-27 14:00:00', 40), -- BOS to IAH
('WN787', 34, 36, '2025-03-27 13:00:00', '2025-03-27 15:30:00', 50), -- LAS to EWR
('AA898', 35, 37, '2025-03-27 16:00:00', '2025-03-27 18:00:00', 35), -- CLT to MSP
('UA909', 38, 40, '2025-03-27 09:30:00', '2025-03-27 11:00:00', 25), -- DTW to BWI
('DL010', 39, 41, '2025-03-27 12:30:00', '2025-03-27 14:00:00', 55), -- SLC to SAN
('WN112', 22, 27, '2025-03-27 14:30:00', '2025-03-27 17:00:00', 45), -- JFK to DFW
('AA223', 23, 30, '2025-03-27 07:30:00', '2025-03-27 10:30:00', 60), -- LAX to DEN
('UA334', 24, 31, '2025-03-27 10:30:00', '2025-03-27 12:30:00', 40), -- ORD to BOS
('DL445', 25, 34, '2025-03-27 13:30:00', '2025-03-27 16:00:00', 30), -- MIA to LAS
('WN556', 26, 35, '2025-03-27 16:30:00', '2025-03-27 18:30:00', 50), -- ATL to CLT
('AA667', 28, 38, '2025-03-28 08:00:00', '2025-03-28 11:00:00', 35), -- SFO to DTW
('UA778', 29, 39, '2025-03-28 11:00:00', '2025-03-28 13:30:00', 45), -- SEA to SLC
('DL889', 30, 40, '2025-03-28 14:00:00', '2025-03-28 16:30:00', 25), -- DEN to BWI
('WN990', 31, 41, '2025-03-28 07:00:00', '2025-03-28 09:30:00', 55), -- BOS to SAN
('AA001', 32, 22, '2025-03-28 10:00:00', '2025-03-28 12:30:00', 40), -- PHX to JFK
('UA112', 33, 23, '2025-03-28 13:00:00', '2025-03-28 16:00:00', 60), -- IAH to LAX
('DL223', 34, 24, '2025-03-28 16:00:00', '2025-03-28 18:30:00', 30), -- LAS to ORD
('WN334', 35, 25, '2025-03-28 09:30:00', '2025-03-28 11:30:00', 50), -- CLT to MIA
('AA445', 36, 26, '2025-03-28 12:30:00', '2025-03-28 14:30:00', 45), -- EWR to ATL
('UA556', 37, 27, '2025-03-28 15:30:00', '2025-03-28 18:00:00', 35), -- MSP to DFW
('DL667', 38, 28, '2025-03-28 08:30:00', '2025-03-28 11:30:00', 25), -- DTW to SFO
('WN778', 39, 29, '2025-03-28 11:30:00', '2025-03-28 13:00:00', 55), -- SLC to SEA
('AA889', 40, 30, '2025-03-28 14:30:00', '2025-03-28 17:00:00', 40), -- BWI to DEN
('UA990', 41, 31, '2025-03-28 07:30:00', '2025-03-28 10:00:00', 60); -- SAN to BOS


-- Bookings table dummy data insertion format

INSERT INTO Bookings (flight_id, passenger_name, passenger_email, passenger_phone) VALUES
(1, 'Ankit', 'ankit@example.com', '555-123-4567'),  -- JFK to LAX
(2, 'Kumar', 'kumar@example.com', NULL),        -- LAX to ORD
(3, 'Chief', 'chief@example.com', '555-987-6543'); -- ORD to MIA