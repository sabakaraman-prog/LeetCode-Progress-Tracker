import { useEffect, useMemo, useState } from "react";

const initialGoals = [
  { title: "Solve 100 Easy Problems", total: 100, difficulty: "Easy" },
  { title: "Solve 75 Medium Problems", total: 75, difficulty: "Medium" },
  { title: "Solve 25 Hard Problems", total: 25, difficulty: "Hard" },
];

const defaultProblems = [
  {
    name: "Two Sum",
    difficulty: "Easy",
    date: "3/20/2026",
    tags: ["Array", "Hash Table"],
  },
  {
    name: "Add Two Numbers",
    difficulty: "Medium",
    date: "3/19/2026",
    tags: ["Linked List", "Math"],
  },
  {
    name: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    date: "3/18/2026",
    tags: ["Binary Search", "Array"],
  },
];

export default function LeetCodeTracker() {
  const [problems, setProblems] = useState(() => {
    const saved = localStorage.getItem("leetcode-problems");
    return saved ? JSON.parse(saved) : defaultProblems;
  });

  useEffect(() => {
    localStorage.setItem("leetcode-problems", JSON.stringify(problems));
  }, [problems]);

  const counts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    for (let i = 0; i < problems.length; i++) {
      const difficulty = problems[i].difficulty.toLowerCase();

      if (difficulty === "easy") easy += 1;
      else if (difficulty === "medium") medium += 1;
      else if (difficulty === "hard") hard += 1;
    }

    return {
      easy,
      medium,
      hard,
      total: problems.length,
    };
  }, [problems]);

  const calculateStreak = () => {
    if (problems.length === 0) return 0;

    const solvedDates = new Set(problems.map((p) => p.date));

    let streak = 0;
    const current = new Date();

    while (true) {
      const dateString = current.toISOString().split("T")[0];

      if (solvedDates.has(dateString)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  const progressPercent = Math.min(
    Math.round((counts.total / 300) * 100),
    100
  );

  const goals = initialGoals.map((goal) => {
    let current = 0;

    if (goal.difficulty === "Easy") current = counts.easy;
    else if (goal.difficulty === "Medium") current = counts.medium;
    else if (goal.difficulty === "Hard") current = counts.hard;

    return {
      ...goal,
      current,
      percent: Math.min(Math.round((current / goal.total) * 100), 100),
    };
  });

  const stats = [
    {
      title: "Total Solved",
      value: String(counts.total),
      subtitle: `${counts.easy}E / ${counts.medium}M / ${counts.hard}H`,
      icon: "</>",
      iconClass: "blue",
    },
    {
      title: "Current Streak",
      value: `${streak} day${streak === 1 ? "" : "s"}`,
      subtitle: streak > 0 ? "Keep it going!" : "Solve one today!",
      icon: "",
      iconClass: "orange",
    },
    {
      title: "This Week",
      value: String(Math.min(problems.length, 7)),
      subtitle: "Recent problems",
      icon: "",
      iconClass: "green",
    },
    {
      title: "Progress",
      value: `${progressPercent}%`,
      subtitle: "Towards 300 problems",
      icon: "",
      iconClass: "purple",
    },
  ];

  const addProblem = () => {
    const name = prompt("Enter problem name:");
    if (!name || !name.trim()) return;

    const difficultyInput = prompt("Enter difficulty: Easy, Medium, or Hard");
    if (!difficultyInput || !difficultyInput.trim()) return;

    const formattedDifficulty =
      difficultyInput.charAt(0).toUpperCase() +
      difficultyInput.slice(1).toLowerCase();

    if (
      formattedDifficulty !== "Easy" &&
      formattedDifficulty !== "Medium" &&
      formattedDifficulty !== "Hard"
    ) {
      alert("Difficulty must be Easy, Medium, or Hard.");
      return;
    }

    const tagsInput = prompt("Enter tags separated by commas (optional):");
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : ["User Added"];

    const newProblem = {
      name: name.trim(),
      difficulty: formattedDifficulty,
      date: new Date().toLocaleDateString(),
      tags: tags.length > 0 ? tags : ["User Added"],
    };

    setProblems([newProblem, ...problems]);
  };

  const deleteProblem = (indexToDelete) => {
    const updatedProblems = problems.filter(
      (_, index) => index !== indexToDelete
    );
    setProblems(updatedProblems);
  };

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <div className="hero-top">
            <div className="title-group">
              <div className="logo-box">&lt;/&gt;</div>

              <div>
                <h1 className="main-title">LeetCode Tracker</h1>
                <p className="subtitle">Track your coding journey</p>
              </div>
            </div>

            <button className="add-button" onClick={addProblem} type="button">
              + Add Problem
            </button>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="card stat-card" key={stat.title}>
              <div className="card-top">
                <div>
                  <p className="card-label">{stat.title}</p>
                  <h2 className="card-value">
                    {stat.title === "Current Streak" ? (
                      <>
                        {stat.value} <span className="fire-emoji">🔥</span>
                      </>
                    ) : (
                      stat.value
                    )}
                  </h2>
                  <p className="card-subtext">{stat.subtitle}</p>
                </div>

                <div className={`icon-box ${stat.iconClass}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="section">
          <div className="section-title-row">
            <span className="section-icon">◎</span>
            <h2 className="section-title">Goals</h2>
          </div>

          <div className="goals-grid">
            {goals.map((goal) => (
              <div className="card goal-card" key={goal.title}>
                <div className="goal-top">
                  <div className="goal-left">
                    <div className="small-icon">◎</div>

                    <div>
                      <h3 className="goal-title">{goal.title}</h3>
                      <p className="goal-subtext">
                        {goal.current} / {goal.total}
                      </p>
                    </div>
                  </div>

                  <span className="goal-percent">{goal.percent}%</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${goal.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title recent-title">Recent Problems</h2>

          <div className="problems-list">
            {problems.map((problem, index) => (
              <div className="card problem-card" key={`${problem.name}-${index}`}>
                <div className="problem-header">
                  <h3 className="problem-title">
                    {problem.name} <span className="external-arrow">↗</span>
                  </h3>

                  <button
                    className="delete-button"
                    onClick={() => deleteProblem(index)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>

                <div className="problem-meta">
                  <span
                    className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="problem-date">{problem.date}</span>
                </div>

                <div className="tags-row">
                  {problem.tags.map((tag, tagIndex) => (
                    <span className="tag" key={`${tag}-${tagIndex}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}