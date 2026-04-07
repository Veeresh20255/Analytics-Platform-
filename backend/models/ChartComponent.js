import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function ChartComponent({ data, xAxis, yAxis }) {
    return (
        <BarChart width={600} height={300} data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yAxis} fill="#8884d8" />
        </BarChart>
    );
}

export default ChartComponent;
