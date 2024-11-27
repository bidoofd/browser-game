import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number | undefined;

  @Column({ type: "varchar" })
  firstName: string | undefined;

  @Column({ type: "varchar" })
  time: string | undefined;
}
