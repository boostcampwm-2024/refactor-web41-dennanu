import BarChartItem from "@/components/chart/BarChartItem";
import PieChartItem from "@/components/chart/PieChartItem";

import { useChart } from "@/hooks/queries/useChart";

export default function Chart() {
  const { data, isLoading, error } = useChart();
  if (!data) return <p>데이터를 불러오는 중입니다...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  const { chartAll, chartToday, chartPlatform } = data;

  return (
    <div>
      <div className="flex">
        <BarChartItem title="전체 조회수" description="전체 조회수 TOP5" data={chartAll.data} />
        <BarChartItem title="오늘의 조회수" description="금일 조회수 TOP5" data={chartToday.data} />
      </div>
      <div>
        <PieChartItem data={chartPlatform.data} title="플랫폼별 블로그 수" />
      </div>
    </div>
  );
}
