-- BEGIN: Create paymentMethods table
CREATE TABLE IF NOT EXISTS paymentmethods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  safedelete INT NOT NULL DEFAULT 0
);
-- END: Create paymentMethods table
-- BEGIN: Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  vehicleId INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  userId INT NOT NULL,
  paymentMethodId INT NOT NULL,
  FOREIGN KEY (paymentMethodId) REFERENCES paymentmethods(id)
);
-- END: Create payments table

INSERT INTO paymentmethods (name) VALUES ('MBWay');
INSERT INTO paymentmethods (name) VALUES ('PayPal');
INSERT INTO paymentmethods (name) VALUES ('Credit Card');
INSERT INTO paymentmethods (name) VALUES ('Bank Transfer');
INSERT INTO paymentmethods (name) VALUES ('Cash');

