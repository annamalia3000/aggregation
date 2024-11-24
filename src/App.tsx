import React, { useState, useEffect } from "react";

type ListItem = {
  date: string;
  amount: number;
};

type MonthItem = {
  month: string;
  amount: number;
};

type YearItem = {
  year: number;
  amount: number;
};

type ListProps = {
  list: ListItem[];
};

type TransformedProps<T> = {
  list: T[];
};

function YearTable(props: TransformedProps<YearItem>) {
  console.log("YearTable", props);

  return (
    <div>
      <h2>Year Table</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {props.list.map((item) => (
            <tr>
              <td>{item.year}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function SortTable(props: TransformedProps<ListItem>) {
  console.log("SortTable", props);

  return (
    <div>
      <h2>Sort Table</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {props.list.map((item) => (
            <tr>
              <td>{item.date}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MonthTable(props: TransformedProps<MonthItem>) {
  console.log("MonthTable", props);

  return (
    <div>
      <h2>Month Table</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {props.list.map((item) => (
            <tr>
              <td>{item.month}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function withDataTransformation<T>(
  Component: React.ComponentType<TransformedProps<T>>,
  transformFunction: (list: ListItem[]) => T[]
) {
  return function TransformedComponent(props: ListProps) {
    const transformedList = transformFunction(props.list);
    return <Component list={transformedList} />;
  };
}

function transforToYear(list: ListItem[]): YearItem[] {
  return list
    .reduce<YearItem[]>((acc, item) => {
      const year = new Date(item.date).getFullYear();
      const existingYear = acc.find((item) => item.year === year);

      if (existingYear) {
        existingYear.amount += item.amount;
      } else {
        acc.push({ year, amount: item.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => a.year - b.year);
}

function transforToMonth(list: ListItem[]): MonthItem[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return list
    .reduce<MonthItem[]>((acc, item) => {
      const date = new Date(item.date);
      const month = monthNames[date.getMonth()];
      const existingMonth = acc.find((item) => item.month === month);

      if (existingMonth) {
        existingMonth.amount += item.amount;
      } else {
        acc.push({ month, amount: item.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
}

function transformToSort(list: ListItem[]): ListItem[] {
  return list.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

const YearTableWithData = withDataTransformation(YearTable, transforToYear);
const MonthTableWithData = withDataTransformation(MonthTable, transforToMonth);
const SortTableWithData = withDataTransformation(SortTable, transformToSort);
// TODO:
// 1. Загрузите данные с помощью fetch: https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hoc/aggregation/data/data.json
// 2. Не забудьте вынести URL в переменные окружения (не хардкодьте их здесь)
// 3. Положите их в state

export default function App() {
  const [list, setList] = useState<ListItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);

        if (data && Array.isArray(data.list)) {
          setList(data.list);
        } else {
          console.error("Fetched data does not contain a list array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="app">
      <MonthTableWithData list={list} />
      <YearTableWithData list={list} />
      <SortTableWithData list={list} />
    </div>
  );
}
