CREATE TABLE `questions` (
  `question_Id` int AUTO_INCREMENT,
  `quiz_Id` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `option1` varchar(45) NOT NULL,	
  `option2` varchar(45) NOT NULL,
  `option3` varchar(45) NOT NULL,
  `option4` varchar(45) NOT NULL,
  `correctAnswer` varchar(45) NOT NULL,
  `questionPoint` int DEFAULT 1,
  PRIMARY KEY (`question_Id`),
  KEY `quiz_Id_idx` (`quiz_Id`),
  CONSTRAINT `quiz_Id` FOREIGN KEY (`quiz_Id`) REFERENCES `quiz` (`quiz_Id`)
)