import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { URL } from 'url';


export default registerAs(
  'database',
  (): SequelizeModuleOptions => {

    if (!process.env.DATABASE_URL) {
      throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
    }

    const dbUrl = new URL(process.env.DATABASE_URL);

    return {
      dialect: 'postgres',
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port, 10),
      username: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),

      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },

      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production',
      // sync: { force: true },

      logging: false,
    };
  },
);