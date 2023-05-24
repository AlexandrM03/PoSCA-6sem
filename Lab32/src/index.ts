import express, { Request, Response } from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());
const swaggerFile = fs.readFileSync('./swagger.json', 'utf8');
const swaggerDocument = JSON.parse(swaggerFile);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const phonebookFile = './phonebook.json';

interface Phone {
    id: number;
    name: string;
    phoneNumber: string;
}

function readPhonebook(): Phone[] {
    try {
        const data = fs.readFileSync(phonebookFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read phonebook:', error);
        return [];
    }
}

function writePhonebook(phonebook: Phone[]): void {
    try {
        const data = JSON.stringify(phonebook);
        fs.writeFileSync(phonebookFile, data, 'utf-8');
    } catch (error) {
        console.error('Failed to write phonebook:', error);
    }
}

app.get('/TS', (req: Request, res: Response) => {
    const phonebook = readPhonebook();
    res.json(phonebook);
});

app.post('/TS', (req: Request, res: Response) => {
    const { id, name, phoneNumber } = req.body;
    const newPhone: Phone = { id, name, phoneNumber };
    const phonebook = readPhonebook();
    phonebook.push(newPhone);
    writePhonebook(phonebook);
    res.sendStatus(201);
});

app.put('/TS', (req: Request, res: Response) => {
    const { id, name, phoneNumber } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    } else {
        phonebook[phoneIndex] = { id, name, phoneNumber };
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});

app.delete('/TS', (req: Request, res: Response) => {
    const { id } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    } else {
        phonebook.splice(phoneIndex, 1);
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
