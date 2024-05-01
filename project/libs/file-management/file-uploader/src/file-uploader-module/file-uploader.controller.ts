import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import { FileUploaderService } from './file-uploader.service';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';

@Controller('files')
export class FileUploaderController {
  constructor(
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  @Get(':fileId')
  @ApiOperation({ summary: 'Get file details' })
  @ApiResponse({ status: 200, description: 'File details retrieved successfully.', type: UploadedFileRdo })
  @ApiResponse({ status: 404, description: 'File not found.' })
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const foundFile = await this.fileUploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, foundFile.toPOJO());
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'The file has been successfully uploaded.', type: UploadedFileRdo })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data')
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const createdFile = await this.fileUploaderService.saveFile(file);
    return fillDto(UploadedFileRdo, createdFile.toPOJO());
  }
}