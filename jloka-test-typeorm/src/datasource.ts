// import { Category } from "src/category/category.entity";
// import { Post } from "src/post/post.entity";
// import { Profile } from "src/profile/profile.entity";
// import { User } from "src/users/user.entity";
// import { UserSubscriber } from "src/users/users.subscriber";
// import path, { join } from "path";
import { DataSource } from "typeorm";
// import { fileURLToPath } from "url";

// console.log(__dirname + "./src/**/*.entity.{ts,js}")
// console.log(__dirname + "./src/migrations/*.{ts,js}")

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.resolve();

export default new DataSource({
  type: 'mariadb', 
  synchronize: false,
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123",
  database: "jloka_nestjs_01",
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  // subscribers: [
  //   __dirname, "/**/*.subscriber.{ts,js}"
  // ],
})