import express from 'express';
import oracledb from 'oracledb';

const router = express.Router();

// Função de validação dos dados do aluno
function validateStudentData(data) {
    const { cpf, nome, sobrenome, data_nasc, email, telefone, genero, peso, altura } = data;
    const errors = [];
    
    if (!cpf) errors.push('CPF é obrigatório');
    if (!nome) errors.push('Nome é obrigatório');
    if (!sobrenome) errors.push('Sobrenome é obrigatório');
    if (!data_nasc) errors.push('Data de nascimento é obrigatória');
    if (!email) errors.push('Email é obrigatório');
    if (!telefone) errors.push('Telefone é obrigatório');
    if (peso && isNaN(peso)) errors.push('Peso deve ser um número');
    if (altura && isNaN(altura)) errors.push('Altura deve ser um número');

    return errors.length > 0 ? errors : null;
}

// Função para cadastrar aluno
async function registerStudent(studentData, res) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const existingStudent = await connection.execute(
            `SELECT COUNT(*) AS count FROM Aluno WHERE Cpf = :cpf OR Email = :email`,
            { cpf: studentData.cpf, email: studentData.email }
        );

        if (existingStudent.rows[0].COUNT > 0) {
            return res.status(400).json({ success: false, message: 'CPF ou email já cadastrado' });
        }

        await connection.execute(
            `INSERT INTO Aluno (Cpf, Nome, Sobrenome, Data_nasc, Email, Telefone, Genero, peso, altura) 
             VALUES (:cpf, :nome, :sobrenome, TO_DATE(:data_nasc, 'YYYY-MM-DD'), :email, :telefone, :genero, :peso, :altura)`,
            { 
                cpf: studentData.cpf, 
                nome: studentData.nome, 
                sobrenome: studentData.sobrenome, 
                data_nasc: studentData.data_nasc, 
                email: studentData.email, 
                telefone: studentData.telefone, 
                genero: studentData.genero,
                peso: studentData.peso,
                altura: studentData.altura,
            },
            { autoCommit: true }
        );

        res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso' });
    } catch (err) {
        console.error('Erro ao cadastrar aluno:', err);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno: ' + err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Erro ao fechar a conexão:', err);
            }
        }
    }
}

// Rota de cadastro
router.post('/cadastrar-aluno', async (req, res) => {
    const studentData = req.body;
    const validationErrors = validateStudentData(studentData);
    
    if (validationErrors) {
        return res.status(400).json({ success: false, message: 'Dados inválidos: ' + validationErrors.join(', ') });
    }

    await registerStudent(studentData, res);
});

// Rota para listar todos os alunos
router.get('/relatorios-alunos', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        
        // Consulta SQL para pegar todos os alunos
        const result = await connection.execute('SELECT * FROM Aluno'); // Substitua 'Aluno' pelo nome da sua tabela

        const alunos = result.rows.map(row => ({
            nome: row[1],
            sobrenome: row[2],
            cpf: row[0],
            data_nasc: row[3],
            email: row[4],
            telefone: row[5],
            genero: row[6],
            peso: row[7],
            altura: row[8]
        }));

        res.json(alunos); // Retorna os dados dos alunos no formato JSON
    } catch (err) {
        console.error('Erro ao consultar os alunos:', err);
        res.status(500).send('Erro ao consultar os alunos.');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Erro ao fechar a conexão com o banco:', err);
            }
        }
    }
});

export default router;
