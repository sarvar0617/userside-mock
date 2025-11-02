import { useEffect, useState } from "react";
import api from "./api/api.js";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/");
        const filtered = res.data.filter((user) => {
          const listening = Number(user.listening);
          const reading = Number(user.reading);
          const writing = Number(user.writing);
          const speaking = Number(user.speaking);
          return (
            listening >= 0 &&
            listening <= 75 &&
            reading >= 0 &&
            reading <= 75 &&
            writing >= 0 &&
            writing <= 75 &&
            speaking >= 0 &&
            speaking <= 75
          );
        });
        setUsers(filtered);
      } catch (err) {
        console.error("API bilan ulanishda xatolik:", err);
      }
    };
    fetchUsers();
  }, []);

  // .50 bo‘lsa tepaga chiqarmaydi, faqat >0.5 bo‘lsa chiqadi
  const getRoundedScore = (num) => {
    const decimal = num % 1;
    return decimal > 0.5 ? Math.ceil(num) : Math.floor(num);
  };

  // level aniqlash
  const getLevel = (overall) => {
    if (overall >= 65) return { text: "C1", color: "text-green-400" };
    if (overall >= 50.5) return { text: "B2", color: "text-yellow-400" };
    if (overall >= 38) return { text: "B1", color: "text-blue-400" };
    return { text: "A2", color: "text-red-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-blue-800 text-slate-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border border-white/10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 text-blue-400 tracking-wide">
          🎓 Student Results Dashboard
        </h1>

        {/* TABLE for desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-blue-700/40 text-blue-100">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-center font-semibold">Listening</th>
                <th className="py-3 px-4 text-center font-semibold">Reading</th>
                <th className="py-3 px-4 text-center font-semibold">Writing</th>
                <th className="py-3 px-4 text-center font-semibold">Speaking</th>
                <th className="py-3 px-4 text-center font-semibold">Overall</th>
                <th className="py-3 px-4 text-center font-semibold">Level</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => {
                  const listening = Number(user.listening);
                  const reading = Number(user.reading);
                  const writing = Number(user.writing);
                  const speaking = Number(user.speaking);
                  const rawOverall =
                    (listening + reading + writing + speaking) / 4;
                  const rounded = getRoundedScore(rawOverall);
                  const { text: levelText, color: levelColor } =
                    getLevel(rounded);

                  return (
                    <tr
                      key={user.id}
                      className={`transition-all ${
                        index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                      } hover:bg-blue-600/30`}
                    >
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-center">{listening}</td>
                      <td className="py-3 px-4 text-center">{reading}</td>
                      <td className="py-3 px-4 text-center">{writing}</td>
                      <td className="py-3 px-4 text-center">{speaking}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-300">
                        {rounded}
                      </td>
                      <td
                        className={`py-3 px-4 text-center font-bold ${levelColor}`}
                      >
                        {levelText}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-2xl text-slate-400 italic"
                  >
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARD VIEW for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {users.length > 0 ? (
            users.map((user) => {
              const listening = Number(user.listening);
              const reading = Number(user.reading);
              const writing = Number(user.writing);
              const speaking = Number(user.speaking);
              const rawOverall =
                (listening + reading + writing + speaking) / 4;
              const rounded = getRoundedScore(rawOverall);
              const { text: levelText, color: levelColor } =
                getLevel(rounded);

              return (
                <div
                  key={user.id}
                  className="bg-blue-900/40 border border-blue-700/50 rounded-2xl p-4 text-sm shadow-md backdrop-blur-lg transition-transform hover:scale-[1.02]"
                >
                  <h2 className="text-lg font-semibold text-blue-300 mb-2">
                    {user.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-y-1 text-slate-200">
                    <p>🎧 Listening:</p>
                    <p className="text-right">{listening}</p>
                    <p>📖 Reading:</p>
                    <p className="text-right">{reading}</p>
                    <p>✍️ Writing:</p>
                    <p className="text-right">{writing}</p>
                    <p>🗣️ Speaking:</p>
                    <p className="text-right">{speaking}</p>
                    <p className="font-semibold text-blue-300 mt-2">⭐ Overall:</p>
                    <p className="text-right font-semibold text-blue-300 mt-2">
                      {rounded}
                    </p>
                    <p className="font-semibold mt-1">🏆 Level:</p>
                    <p
                      className={`text-right font-bold ${levelColor} mt-1`}
                    >
                      {levelText}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 italic text-lg">
              Loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
