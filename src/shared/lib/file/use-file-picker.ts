import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

export type UseFilePickerProps = {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onMaxSizeError?: () => void;
};

export const useFilePicker = ({
  accept,
  maxSize,
  multiple,
  onMaxSizeError,
}: UseFilePickerProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );

  const clearFileList = useCallback(() => {
    setFiles([]);
    fileInputRef.current.value = '';
  }, []);

  const handleChange = async ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (files) {
      let isMaxSizeOk = true;

      if (typeof maxSize === 'number') {
        isMaxSizeOk = Array.from(files).every((file) => file.size <= maxSize);
      }

      if (isMaxSizeOk) {
        setFiles(Array.from(files));
      } else {
        onMaxSizeError?.();
        clearFileList();
      }
    }
  };

  useEffect(() => {
    const input = fileInputRef.current;

    input.type = 'file';
    input.multiple = multiple ?? input.multiple;
    input.accept = accept ?? input.accept;
    input.addEventListener('change', handleChange as any);

    return () => {
      input.removeEventListener('change', handleChange as any);
      input.remove();
    };
  }, [multiple, accept]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return [files, handleUploadClick, clearFileList] as const;
};
