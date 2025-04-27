// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// import { Module } from '@nestjs/common';

// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { ProjectsModule } from './projects/projects.module';
// import { BidsModule } from './bids/bids.module';
// import { MilestonesModule } from './milestones/milestones.module';
// import { InvoicesModule } from './invoices/invoices.module';
// import { MessagesModule } from './messages/messages.module';
// import { FilesModule } from './files/files.module';
// import { SkillsModule } from './skills/skills.module';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       // way 1
//       type: 'mysql',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     UsersModule,
//     AuthModule,
//     ProjectsModule,
//     BidsModule,
//     MilestonesModule,
//     InvoicesModule,
//     MessagesModule,
//     FilesModule,
//     SkillsModule,
//   ],
//   controllers: [AppController],

//   providers: [AppService],
// })
// export class AppModule {}

// // export class AppModule {
// //   configure(consumer: MiddlewareConsumer) {
// //     consumer.apply(LoggerMiddleware).forRoutes('*');
// //   }
// // }

// src/app.module.ts
// import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BidsModule } from './bids/bids.module';
import { MilestonesModule } from './milestones/milestones.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MessagesModule } from './messages/messages.module';
import { FilesModule } from './files/files.module';
import { SkillsModule } from './skills/skills.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_DATABASE', 'freelance_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    BidsModule,
    MilestonesModule,
    InvoicesModule,
    MessagesModule,
    FilesModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
