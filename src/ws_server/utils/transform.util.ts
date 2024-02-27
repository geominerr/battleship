import { JsonTransformError } from '../custom-errors/custom-erros';
import { RequestType } from '../models/request.model';
import { ResponseType } from '../models/response.model';

export const parseRequest = (req: string): RequestType => {
  try {
    const parsedRequest = JSON.parse(req);
    const data = parsedRequest?.data ? JSON.parse(parsedRequest.data) : '';

    return { ...parsedRequest, data };
  } catch {
    throw new JsonTransformError();
  }
};

export const stringifyResponse = (res: ResponseType): string => {
  try {
    return JSON.stringify({ ...res, data: JSON.stringify(res.data) });
  } catch {
    throw new JsonTransformError();
  }
};
