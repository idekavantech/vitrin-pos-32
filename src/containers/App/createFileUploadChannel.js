import { buffers, eventChannel, END } from 'redux-saga';
export function createUploadFileChannel(endpoint, file) {
  return eventChannel(emitter => {
    const xhr = new XMLHttpRequest();
    const onProgress = e => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        emitter({ progress });
      }
    };
    const onFailure = () => {
      emitter({ err: new Error('Upload failed') });
      emitter(END);
    };
    xhr.upload.addEventListener('progress', onProgress);
    xhr.upload.addEventListener('error', onFailure);
    xhr.upload.addEventListener('abort', onFailure);
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr;
      if (readyState === 4) {
        if (status === 200) {
          emitter({ success: true });
          emitter(END);
        } else {
          onFailure(null);
        }
      }
    };
    xhr.open('PUT', endpoint, true);
    xhr.send(file);
    return () => {
      xhr.upload.removeEventListener('progress', onProgress);
      xhr.upload.removeEventListener('error', onFailure);
      xhr.upload.removeEventListener('abort', onFailure);
      xhr.onreadystatechange = null;
      xhr.abort();
    };
  }, buffers.sliding(2));
}
