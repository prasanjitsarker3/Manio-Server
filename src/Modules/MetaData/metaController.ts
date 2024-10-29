import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { metaService } from "./metaService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const adminDashboardMetaData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await metaService.adminDashboardMetaData();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MetaData Retrieve Successfully",
      data: result,
    });
  }
);
const moderatorDashboardData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await metaService.moderatorDashboardData();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MetaData Retrieve Successfully",
      data: result,
    });
  }
);

export const metaController = {
  adminDashboardMetaData,
  moderatorDashboardData,
};
