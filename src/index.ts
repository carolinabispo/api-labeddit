import express, { Request, Response } from "express";
import cors from "cors";
import { users } from "./database";
import { TUser } from "./types";
import { error } from "console";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

// get de users
app.get("/user", (req: Request, res: Response) => {
  const userToFind = req.query.apelido as string;

  if (userToFind) {
    const result: TUser[] = users.filter((user) =>
      user.apelido.toLowerCase().includes(userToFind.toLowerCase())
    );
    res.status(200).send(result);
  } else {
    res.status(200).send(users);
  }
});

// get com path params

app.get("/user/:id", (req: Request, res: Response) => {
  try {
    const idToFind = req.params.id;

    const result = users.find((user) => user.id === idToFind);

    if (!result) {
      res.status(404);
      throw new Error("Usuário não encontrado");
    }

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

// create user
app.post("/user", (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const apelido = req.body.apelido;
    const email = req.body.email;
    const password = req.body.password;

    if (typeof id !== "string") {
      res.status(404);
      throw new Error("'id' deve ser uma sring");
    }
    if (typeof apelido !== "string") {
      res.status(404);
      throw new Error("'Apelido' deve ser uma string");
    }
    if (apelido.length < 5) {
      res.status(404)
      throw new Error("'Apelido' deve conter pelo menos 5 caracteres")
    }
    if (typeof email !== "string") {
      res.status(404);
      throw new Error("'email' deve ser uma string");
    }
    if (typeof password !== "string") {
      res.status(404);
      throw new Error("'senha' deve ser uma tring");
    }

    const newUser: TUser = {
      id: Date.now().toString(),
      apelido,
      email,
      password,
    };

    users.push(newUser);
    res.status(201).send(newUser);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// edit user

app.put("/user/:id", (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    // const newId = req.body.id as string | undefined;
    const newApelido = req.body.apelido as string | undefined;
    const newEmail = req.body.email as string | undefined;
    const newPassword = req.body.password as string | undefined;

    if (typeof newApelido !== "string") {
      res.status(404);
      throw new Error("O novo apelido deve ser uma string");
    }
    if (typeof newEmail !== "string") {
      res.status(404);
      throw new Error("O novo email deve ser uma string");
    }
    if (typeof newPassword !== "string") {
      res.status(404);
      throw new Error("A nova senha deve ser uma string");
    }

    const user = users.find((user) => user.id === idToEdit);

    if (user) {
      // user.id = newId || user.id;
      user.apelido = newApelido || user.apelido;
      user.email = newEmail || user.email;
      user.password = newPassword || user.password;

      // quando o valor for um número, é possível que seja 0 (que também é falsy)
      // então para possibilitar que venha 0, podemos fazer um ternário
      // o isNaN é uma função que checa se o argumento é um número ou não
      // caso não seja um número o isNaN retorna true, caso contrário false
      // por isso mantemos o antigo (pet.age) no true e atualizamos no false
      // pet.age = isNaN(Number(newAge)) ? pet.age : newAge as number
    }

    res.status(200).send("Atualização realizada com sucesso");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// delete user
app.delete("/user/:id", (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;
    const userId = users.findIndex((user) => user.id === idToDelete);

    if (!userId) {
      res.status(404);
      throw new Error("Usúario não encontrado");
    } else {
      users.splice(userId, 1);
    }

    res.status(200).send("Usúario excluido com sucesso");
  } catch (error: any) {
      console.log(error);
      if (res.statusCode === 200) {
        res.status(500);
      }
      res.send(error.message);
  }
});
