import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { input, select, password, confirm } from "@inquirer/prompts";
import { Repository } from "typeorm";


async function main(){
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User)
  

  const menuOptions = [
    {
      name: "Listar todos os usuários",
      value: "listar",
      description: "Lista todos os usuários cadastrados"
    },
    {
      name: "Criar um novo usuário",
      value: "criar",
      description: "Cria um novo usuário"
    },
    {
      name: "Atualizar um usuário",
      value: "atualizar",
      description: "Atualiza um usuário cadastrado"
    },
    {
      name: "Remover um usuário",
      value: "remover",
      description: "Deletar um usuário cadastrado"
    },
    {
      name: "Sair",
      value: "sair",
      description: "Sair do programa"
    },
  ];

  const menu = async () => {
    const answer = await select({
      message: "Escolha uma opção:",
      choices: menuOptions
    });

    switch (answer) {
      case menuOptions[0].value:
        await listUsers(userRepository);
        break;
      case menuOptions[1].value:
        await createUser(userRepository);
        break;
      case menuOptions[2].value:
        await updateUser(userRepository);
        break;
      case menuOptions[3].value:
        await deleteUser(userRepository);
        break;
      case menuOptions[4].value:
        process.exit(0);
    }

    menu();
  };

  menu();
};

async function listUsers(userRepository: Repository<User>) {
  const users: User[] = await userRepository.find();
  console.log("Usuários:");
  console.table(users, ['id', 'username', 'email', 'passwordHash', 'fullName', 'isActive']);

};

async function createUser(userRepository: Repository<User>) {
  const answers = {
    "fullName": await input({ "message": "Informe o nome completo do usuário:" }),
    "username": await input({ "message": "Informe o nome de usuário:" }),
    "email": await input({ "message": "Informe o email do usuário:" }),
    "password": await password({ "message": "Informe a senha desejada:" }),
  };

  console.table(answers)
  const newUser = userRepository.create({
    username: answers.username,
    email: answers.email,
    passwordHash: answers.password,
    fullName: answers.fullName,
  })
  userRepository.save(newUser)
  console.log("Usuário criado com sucesso!");
};

async function updateUser(userRepository: Repository<User>) {
  const answers = {
    "id": await input({ "message": "ID do usuário que terá os dados atualizados:" }),
    "fullName": await input({ "message": "Novo nome completo do usuário:" }),
    "username": await input({ "message": "Informe o nome de usuário:" }),
    "email": await input({ "message": "Novo o email do usuário:" }),
    "password": await password({ "message": "Nova senha:" }),
    "isActive": await confirm({ "message": "É um usuário ativo?:" }),
  };

  console.table(answers)

  await userRepository.update(answers.id, {
    username: answers.username,
    email: answers.email,
    passwordHash: answers.password,
    fullName: answers.fullName,
    isActive: answers.isActive
  });

  console.log("Usuário atualizado com sucesso!");
};

async function deleteUser(userRepository: Repository<User>) {
  const id = await input({message: "ID do usuário a ser removido:" });
  await userRepository.delete(id)
  console.log("Usuário removido com sucesso!");
};

main();
