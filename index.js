const path = require('path');
const fs = require('fs/promises');
const express =  require('express');

const app = express();

app.use(express.json());

app.listen(8001)

const jsonPath = path.resolve('data.json');

app.get('/api/v1/user', async (req, res) =>{
    const users = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    res.status(200).send(users.map(user => {
        return  {
                    user: user.name, 
                    email: user.email
                }
    }));
});

app.post('/api/v1/user', async (req, res)=>{
    const users = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const newUser = req.body;
    users.push({...newUser, id: users[users.length -1].id +1});
    await fs.writeFile(jsonPath, JSON.stringify(users));
    res.sendStatus(201);
})

app.put('/api/v1/user/:id', async (req, res)=>{
    const users = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const update = req.body;
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    users.splice(index, 1, {...update, id: id});
    if(index !== -1){
        await fs.writeFile(jsonPath, JSON.stringify(users));
        res.sendStatus(200);
    }
    else{
        res.status(404).send('Not Found');
    };
});

app.delete('/api/v1/user/:id', async (req, res)=>{
    const users = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const id = Number(req.params.id);
    /*const index = users.findIndex(user => user.id === id);
    users.splice(index, 1);
    if(index !== -1){
        await fs.writeFile(jsonPath, JSON.stringify(users));
        res.sendStatus(200);
    }
    else{
        res.status(404).send('Not Found');
    };*/
    const filteredUsers = users.filter(user => user.id !== id)
    await fs.writeFile(jsonPath, JSON.stringify(filteredUsers));
    res.sendStatus(200);
})
