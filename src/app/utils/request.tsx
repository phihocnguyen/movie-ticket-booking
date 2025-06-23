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
      // Trả về message để phía bên kia showError
      showErrorMessage(result.message);
      return;
    }
    return result; // Thành công: trả về toàn bộ object
  } catch (error: any) {
    // Lỗi ngoài fetch hoặc JSON parsing
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return null; // hoặc throw nếu bạn muốn bên gọi xử lý tiếp
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

    // Nếu auth=true thì thêm Authorization
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
      return result;
    } else {
      showErrorMessage(result.message);
      return;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return null;
  }
};

export const del = async (path: string, auth = false): Promise<any> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Thêm token nếu auth = true
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

    // Bọc JSON parsing để tránh lỗi khi backend không trả JSON

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      showErrorMessage(result.message);
      return;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message || error}`);
    return null;
  }
};

// export const patch = async (value, path, auth = true) => {
//   try {
//     const headers = {
//       "Content-type": "application/json",
//       Accept: "application/json",
//     };
//     if (auth) {
//       const token = localStorage.getItem("accessToken");
//       if (token) headers.Authorization = `Bearer ${token}`;
//     }
//     const response = await fetch(API_DOMAIN + path, {
//       method: "PATCH",
//       headers,
//       body: JSON.stringify(value),
//     });
//     if (!response.ok) {
//       throw new Error(`Lỗi: ${response.status}`);
//     }
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     alert(`Lỗi khi gọi API: ${error.message}`);
//   }
// };
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

    // Gắn token nếu cần xác thực
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_DOMAIN + path, {
      method: "PATCH",
      headers,
      body: JSON.stringify(values),
    });

    // Dù response.ok hay không, luôn cố parse JSON nếu có
    const result = await response.json();
    if (response.ok) {
      return result; // Có thể trả object hoặc true
    } else {
      showErrorMessage(result.message);
      return;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return null;
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

    // Gắn token nếu cần xác thực
    if (auth) {
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_DOMAIN + path, {
      method: "PUT",
      headers,
      body: JSON.stringify(values),
    });

    // Dù response.ok hay không, luôn cố parse JSON nếu có
    const result = await response.json();
    if (response.ok) {
      return result; // Có thể trả object hoặc true
    } else {
      showErrorMessage(result.message);
      return;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return null;
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

    // Gắn token nếu cần xác thực
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
      return result;
    } else {
      return result.message;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return null;
  }
};

export const putFormData = async (
  path: string,
  formData: FormData,
  auth = false
): Promise<any> => {
  try {
    const headers: HeadersInit = {};

    // Gắn token nếu cần
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
      return result;
    } else {
      return result.message;
    }
  } catch (error: any) {
    showErrorMessage(`Lỗi khi gọi API: ${error.message}`);
    return null;
  }
};
