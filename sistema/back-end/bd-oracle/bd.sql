CREATE TABLE Aluno (
    Cpf VARCHAR(11) PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Sobrenome VARCHAR(50) NOT NULL,
    Data_nasc DATE NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Telefone VARCHAR(15) NOT NULL,
    peso NUMBER(5),
    altura DECIMAL(5,2),
    Genero CHAR(1)
);
 
CREATE TABLE Secao (
    cod INT PRIMARY KEY,
    entrada_saida CHAR(1) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    cod_aluno INT NOT NULL,
    FOREIGN KEY (cod_aluno) REFERENCES aluno(cod)
);
 
--INSERT INTO Secao (Entrada_Saida, Data_Hora, Cpf_Aluno) VALUES ('E/S', CURRENT_TIMESTAMP, ''
 
-- Criar sequencia para o Cod
CREATE SEQUENCE secao_cod START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE aluno_cod START WITH 100 INCREMENT BY 1;

-- Criar trigger para inserir Cod automaticamente
CREATE OR REPLACE TRIGGER trg_secao_cod
BEFORE INSERT ON secao
FOR EACH ROW
BEGIN
    :NEW.cod := secao_cod.NEXTVAL;
END;

CREATE OR REPLACE TRIGGER trg_aluno_cod
BEFORE INSERT ON aluno
FOR EACH ROW
BEGIN
    :NEW.cod := aluno_cod.NEXTVAL;
END;
 
WITH secao_completa AS (
    SELECT 
        s1.cod_aluno,
        EXTRACT(HOUR FROM (s2.data_hora - s1.data_hora)) + 
        EXTRACT(MINUTE FROM (s2.data_hora - s1.data_hora)) / 60 AS duracao
    FROM 
        secao s1
    JOIN 
        secao s2 ON s1.cod_aluno = s2.cod_aluno 
                  AND s1.entrada_saida = 'E' 
                  AND s2.entrada_saida = 'S'
                  AND s2.data_hora > s1.data_hora
    WHERE 
        s1.data_hora >= TRUNC(SYSDATE, 'IW')  -- Garante que as seções pertencem a mesma semana
        AND NOT EXISTS (
            SELECT 1 FROM secao s3 
            WHERE s3.cod_aluno = s1.cod_aluno 
              AND s3.entrada_saida = 'E' 
              AND s3.data_hora > s1.data_hora 
              AND s3.data_hora < s2.data_hora
        )  -- Certificando que a data de entrada e saida pertencem a mesma secao
),
presenca_semanal AS (
    SELECT 
        a.cod,
        a.nome,
        a.sobrenome,
        COALESCE(SUM(sc.duracao), 0) AS hora_semanais -- Em caso do aluno não possuir presença, o valor null é transformado em númerico
    FROM 
        aluno a
    LEFT JOIN 
        secao_Completa sc ON a.cod = sc.cod_aluno
    GROUP BY 
        a.cod, a.nome, a.sobrenome
)
SELECT 
    cod,
    nome,
    sobrenome,
    hora_semanais,
    CASE
        WHEN hora_semanais > 20 THEN 'Extremamente avançado'
        WHEN hora_semanais > 10 THEN 'Avançado'
        WHEN hora_semanais > 5 THEN 'Intermediário'
        ELSE 'Iniciante'
    END AS Classificao
FROM 
    presenca_semanal
ORDER BY 
    nome;