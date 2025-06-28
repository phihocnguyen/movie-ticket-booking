import { showErrorMessage } from "./alertHelper";

const API_DOMAIN = "http://localhost:8080/";

// ============================Những api lấy giá trị thông thường===========================

export const get = async (path: string): Promise<any> => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      showErrorMessage(result.message);
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
    return {
      statusCode: response.status,
      message: result.message || "Success",
      data: result.data !== undefined ? result.data : result,
    };
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message || error}`,
      data: null,
    };
  }
};

export const post = async (
  values: any,
  path: string,
  auth = false
): Promise<any> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "POST",
      headers,
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      showErrorMessage(result.message);
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message || error}`,
      data: null,
    };
  }
};

export const del = async (path: string, auth = false): Promise<any> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "DELETE",
      headers,
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      showErrorMessage(result.message);
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message || error}`,
      data: null,
    };
  }
};

export const patch = async (
  values: any,
  path: string,
  auth = true
): Promise<any> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "PATCH",
      headers,
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      showErrorMessage(result.message);
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message}`,
      data: null,
    };
  }
};
export const put = async (
  values: any,
  path: string,
  auth = true
): Promise<any> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "PUT",
      headers,
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      showErrorMessage(result.message);
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message}`,
      data: null,
    };
  }
};

// =============================những api có gửi file (multipart/form-data)===========================

export const postFormData = async (
  path: string,
  formData: FormData,
  auth = false
): Promise<any> => {
  try {
    const headers: HeadersInit = {};
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "POST",
      headers, // KHÔNG đặt Content-Type cho FormData
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message}`,
      data: null,
    };
  }
};

export const putFormData = async (
  path: string,
  formData: FormData,
  auth = false
): Promise<any> => {
  try {
    const headers: HeadersInit = {};
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(API_DOMAIN + path, {
      method: "PUT",
      headers,
      body: formData, // Không tự set Content-Type cho FormData
    });
    const result = await response.json();
    if (response.ok) {
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else {
      return {
        statusCode: response.status,
        message: result.message || "Request failed",
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message}`,
      data: null,
    };
  }
};

// những api đặc biệt
export const getByEmail = async (path: string): Promise<any> => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      return {
        statusCode: response.status,
        message: result.message || "Success",
        data: result.data !== undefined ? result.data : result,
      };
    } else if (response.status === 404) {
      // Bắt riêng lỗi 404
      return {
        statusCode: 404,
        message: "Không tồn tại",
        data: null,
      };
    } else {
      // Nếu không ok, cố gắng parse JSON, nếu lỗi thì trả về message mặc định
      let message = "Request failed";
      try {
        const result = await response.json();
        message = result.message || message;
      } catch (e) {
        // Không làm gì, giữ message mặc định
      }
      return {
        statusCode: response.status,
        message,
        data: null,
      };
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return {
      statusCode: 500,
      message: `Lỗi khi gọi API: ${error.message || error}`,
      data: null,
    };
  }
};
