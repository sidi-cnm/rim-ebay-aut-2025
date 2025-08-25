PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nameAr TEXT,
  priority INTEGER DEFAULT 1,
  tag TEXT,
  depth INTEGER NOT NULL,
  parentID INTEGER,
  FOREIGN KEY (parentID) REFERENCES options(id) ON DELETE CASCADE
);
INSERT INTO options VALUES(1,'Nouakchott','نواكشوط',1,'',1,NULL);
INSERT INTO options VALUES(2,'Trarza','اترارزة',1,'',1,NULL);
INSERT INTO options VALUES(3,'Teyarette','نواكشوط',1,'',2,1);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('options',3);
COMMIT;
