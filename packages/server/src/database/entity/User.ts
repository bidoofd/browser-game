import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number | undefined;

  @Column({ type: "varchar" })
  firstName: string | undefined;

  @Column({ type: "varchar" })
  lastName: string | undefined;

  @Column({ type: "int" })
  age: number | undefined;
}
