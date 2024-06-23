/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable comma-dangle */

import { StatusCodes } from 'http-status-codes';
import { ACCESS_PRIVATE_KEY, JwtProvider } from '~/providers/JwtProvider';

//? Middleware is used to authenticate whether the JWT access Token received from the FE side is valid or not
const isAuthorizaed = async (req, res, next) => {
  //? Cách 1: Lấy accessToken nằm trong resquest cookies phía FE - withCredentials trong file authorizeAxios và credentials trong CORS
  const accessTokenFromCookie = req.cookies?.accessToken;
  if (!accessTokenFromCookie) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! (Token not found)' });
    return;
  }

  //? Cách 2: Lấy accessToken nằm trong trường hợp phía FE lưu LocalStorage và gửi lên thông qua Header Authentication
  // const accessTokenFromHeader = req.headers.authorization;
  // if (!accessTokenFromHeader) {
  //   res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ message: 'Unauthorized! (Token not found)' });
  //   return;
  // }

  try {
    //? Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie, //? Cách 1
      // accessTokenFromHeader, //? Cách 2 (nhớ bỏ chữ Bearer bằng subtring)
      ACCESS_PRIVATE_KEY
    );

    //? Bước 2: Quan trọng: nếu token hợp lệ, cần lưu thông tin đã được giải mã vào req.jwtDecoded để xử dụng ở các tầng xử lý khác
    req.jwtDecoded = accessTokenDecoded;

    //? Bước 3: next() để cho phép request đi tiếp
    next();
  } catch (error) {
    //? Case 1: Nếu accessToken bị hết hạn (expired) thì cần trả về lỗi 410 (GONE) cho phía FE để biết mà gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' });
      return;
    }

    //? Case 2: Nếu accessToken không hợp lệ do bất cứ điều gì khác việc hết hạn thì trả về mã 401 cho FE để xử lý logout || gọi API logout tùy theo trường hợp
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! Please Login.' });
    return;
  }
};

export const authMiddleware = {
  isAuthorizaed,
};
