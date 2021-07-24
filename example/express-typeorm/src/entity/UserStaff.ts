import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum UserSexType {
  /** 未知 */
  unknown = 0,
  /** 男 */
  male = 1,
  /** 女 */
  female = 2,
};

export enum UserMaritalStatus {
  /** 未知 */
  unknown = 0,
  /** 未婚 */
  Unmarried = 1,
  /** 已婚 */
  Married = 2,
  /** 离婚 */
  Divorced = 3,
  /** 已婚生子 */
  MarriedAndHaveChildren = 4,
};

/** 员工工程师类别 */
export enum UserEngineerType {
  /** 未知 */
  unknown = 0,
  /** Front-End Developer 前端开发工程师 */
  FrontEnd = 1,
  /** Back-End Developer 后端开发工程师 */
  BackEnd = 2,
  /** Testor 测试员 */
  Testor = 3,
  /** User Interface Designer 用户界面设计师 */
  UserInterface = 4,
  /** Product Manager 产品经理 */
  ProductManager = 5,
};

export enum UserEducationType {
  /** 未知 */
  unknown = 0,
  /** 初中 */
  JuniorHigh = 1,
  /** 高中 */
  HighSchool = 2,
  /** 中专 */
  Polytechnic = 3,
  /** 大专 */
  JuniorCollege = 4,
  /** 学士(本科) */
  Bachelor = 5,
  /** 硕士 */
  Master = 6,
  /** 博士 */
  Doctorate = 7,
}

export enum UserLevelType {
  /** 未知 */
  unknown = 0,
  /** 实习生 */
  Trainee = 1,
  /** 初级 */
  Beginner = 2,
  /** 中级 */
  Intermediate = 3,
  /** 高级 */
  Advanced = 4,
  /** 专家 */
  Senior = 5,
}

@Entity()
export class UserStaff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: [0, 1, 2], default: 0 })
  sex: UserSexType;
  
  @Column({ nullable: true })
  email: string;
  
  @Column({ nullable: true })
  mobile: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'int', nullable: true, comment: '身份证号码' })
  idCard: number;

  @Column({ type: 'enum', enum: [0, 1, 2, 3, 4, 5], default: 0, comment: '程序员级别' })
  level: UserLevelType;

  @Column({ type: 'enum', enum: [0, 1, 2, 3, 4, 5, 6, 7], default: 0, comment: '学历' })
  education: UserEducationType;

  @Column({ type: 'enum', enum: [0, 1, 2, 3, 4, 5], default: 0, comment: '工程师类别' })
  engineer: UserEngineerType;

  @Column({ type: 'enum', enum: [0, 1, 2, 3, 4], default: 0, comment: '婚姻状况' })
  maritalStatus: UserMaritalStatus;

  @Column({ nullable: true, comment: '地区' })
  area: string;
  
  @Column({ nullable: true, comment: '备注' })
  remarks: string;
  
  @UpdateDateColumn()
  updateAt: Date;
  
  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn({ nullable: true })
  deleteAt: Date;

  @Column({ type: 'timestamp',  nullable: true, comment: '入场时间'})
  admissionAt: Date;
  @Column({ type: 'timestamp',  nullable: true, comment: '离场时间'})
  departureAt: Date;
  @Column({ type: 'timestamp',  nullable: true, comment: '入职时间'})
  entryAt: Date;
  @Column({ type: 'timestamp',  nullable: true, comment: '离职时间'})
  resignationAt: Date;
}
