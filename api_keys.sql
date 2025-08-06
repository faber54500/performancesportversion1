CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    isActive BOOLEAN DEFAULT 1
);

-- Exemple d'insertion des données fournies
INSERT INTO api_keys (`key`, userId, isActive) VALUES
('user-key-12', 12, 1),
('admin-key-123', 123, 1);
