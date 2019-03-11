/**
 * Created by lhn on 2017/7/26.
 */
import request from "../../utils/request"
import {regionApi} from "../../constants/api"

export const uniqueId = async params => request(
	regionApi.uniqueId, {
		method: "get",
		data: params
	})

export const uniqueCnName = async params => request(
	regionApi.uniqueCnName, {
		method: "get",
		data: params
	})

export const uniqueEnName = async params => request(
	regionApi.uniqueEnName, {
		method: "get",
		data: params
	})
