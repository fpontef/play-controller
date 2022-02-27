import axios from "axios";
import { setAlert } from "./alert";
import { GET_SINGERS, SINGER_ERROR } from "../actions/actionTypes";

export const getSingers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/singers");

    dispatch({
      type: GET_SINGERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SINGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
      //payload: { msg: err }
    });
  }
};
