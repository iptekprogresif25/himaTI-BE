const API_BASE = "https://hima-ti-be.vercel.app/api";
(async () => {
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@himati.com", password: "adminpassword" }) // Wait, what's the admin pass?
    });
    const loginData = await loginRes.json();
    console.log("Login:", loginData);
    if (!loginData.success) return;

    const token = loginData.data.token;
    const reqRes = await fetch(`${API_BASE}/asset-requests`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const reqData = await reqRes.text();
    console.log("Asset Requests:", reqData);
  } catch(e) {
    console.error(e);
  }
})();
