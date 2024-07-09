import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { input, select, password, confirm } from "@inquirer/prompts";


async function main(){
  await AppDataSource.initialize();
  

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
        await listUsers();
        break;
      case menuOptions[1].value:
        await createUser();
        break;
      case menuOptions[2].value:
        await updateUser();
        break;
      case menuOptions[3].value:
        await deleteUser();
        break;
      case menuOptions[4].value:
        process.exit(0);
    }

    menu();
  };

  menu();
};

async function listUsers() {
  const users: User[] = [];
  console.log("Usuários:");
  console.table(users, ['id', 'username', 'email', 'passwordHash', 'fullName', 'isActive']);

};

async function createUser() {
  const answers = {
    "fullName": await input({ "message": "Informe o nome completo do usuário:" }),
    "username": await input({ "message": "Informe o nome de usuário:" }),
    "email": await input({ "message": "Informe o email do usuário:" }),
    "password": await password({ "message": "Informe a senha desejada:" }),
  };

  console.table(answers)

  console.log("Usuário criado com sucesso!");
};

async function updateUser() {
  const answers = {
    "id": await input({ "message": "ID do usuário que terá os dados atualizados:" }),
    "fullName": await input({ "message": "Novo nome completo do usuário:" }),
    "username": await input({ "message": "Informe o nome de usuário:" }),
    "email": await input({ "message": "Novo o email do usuário:" }),
    "password": await password({ "message": "Nova senha:" }),
    "isActive": await confirm({ "message": "É um usuário ativo?:" }),
  };

  console.table(answers)

  console.log("Usuário atualizado com sucesso!");
};

async function deleteUser() {
  const id = await input({message: "ID do usuário a ser removido:" });
  
  console.log("Usuário removido com sucesso!");
};

main();
