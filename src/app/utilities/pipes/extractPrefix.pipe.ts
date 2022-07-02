import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'extractPrefix' })
export class ExtractPrefixPipe implements PipeTransform {
  transform(value: string, prefix: string): string {
    return value?.length > 0 && prefix.length > 0
      ? value?.slice(prefix?.length)
      : value;
  }
}
