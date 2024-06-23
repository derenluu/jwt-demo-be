/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable semi */

import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import {
  ACCESS_PRIVATE_KEY,
  JwtProvider,
  REFRESH_PRIVATE_KEY,
} from '~/providers/JwtProvider';

//todo: Use Mock to quickly access user information instead of having to create a Database and then query
const MOCK_DATABASE = {
  USER: {
    ID: 'luuuydanh-sample-12345678',
    EMAIL: 'luuuydanh123c@gmail.com',
    PASSWORD: 'Derenluu583221@',
  },
};

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your email or password is incorrect!' });
      return;
    }

    //todo: If you enter the correct account information, create a token and return it to the Client
    //todo: Create payload information to attach to JWT Token (including id, email from client)
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    };

    //todo: Create access token
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_PRIVATE_KEY,
      // '1h'
      5
    );

    //todo: Create Refresh token
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_PRIVATE_KEY,
      // '1 days'
      15
    );

    //todo: Handle the return of http only cookie to the browser
    //todo: Cookie lifetime is different from token lifetime
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days'),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days'),
    });

    //~ Return user information as well as return the token in case the FE side needs to save the Token in Cookie or LocalStorage
    //~ If FE uses Cookies, it does not use LocalStorage and reverse
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    //todo: Delete Cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    //? Cách 1: Lấy token từ cookie sau đó đính kèm vào request khi gửi về server
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    //? Cách 2: Từ localStorage, FE truyền vào body khi gọi API refreshToken
    // const refreshTokenFromLocalStorage = req.body?.refreshToken;

    //todo: Verify token xem có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie, //? Cách 1
      // refreshTokenFromLocalStorage, //? Cách 2
      REFRESH_PRIVATE_KEY
    );

    //todo: Tạo accessToken mới
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
    };
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_PRIVATE_KEY,
      // '1h'
      5
    );

    //todo: Res lại cookie accessToken mới trong trường hợp xử dụng cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days'),
    });

    //todo: Trả accessToken mới cho trường hợp xử dụng localStorage
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Refresh token API failed' });
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
};
