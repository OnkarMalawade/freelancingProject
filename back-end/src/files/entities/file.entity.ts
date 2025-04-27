import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  fileID: number;

  @Column()
  fileUrl: string;

  @Column()
  filetype: string;

  @Column()
  mid: number;
}
