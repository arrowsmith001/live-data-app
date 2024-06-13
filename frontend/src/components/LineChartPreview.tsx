
import { LineChart, Line, ResponsiveContainer, XAxis } from "recharts";

const LineChartPreview = () => {

    // mock data, just a generic curved line
    const serie = {
        name: 'series',
        data: Array.from({length: 20}, (_, i) => ({'x': i, 'y': Math.sin(i/10)}))
    }


    return       <ResponsiveContainer  width="100%" height="100%">
    <LineChart data={[
        serie
    ]}>

      <XAxis dataKey="x" />
    <Line  type="step" dataKey="y" stroke="white" />
  </LineChart>
      </ResponsiveContainer>
}

export default LineChartPreview;