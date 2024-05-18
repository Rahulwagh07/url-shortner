import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React, { useState, useEffect } from "react";
import { analyticsEndpoints } from '../../../../services/apis';
import { useSelector } from "react-redux";
import { apiConnector } from "../../../../services/apiConnector";
import './MapChart.css';  

const { GET_TOTAL_COUNTRY_ANALYTICS_ADMIN_API } = analyticsEndpoints;

function MapChart() {
  const {token} = useSelector((state) => state.auth)
  const [countries, setCountries] = useState(null)
  const [loading, setLoading] = useState(false);
  const colorScale = ["#bbf7d0", "#16a34a"];

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiConnector('GET', GET_TOTAL_COUNTRY_ANALYTICS_ADMIN_API, null, {
        Authorization: `Bearer ${token}`,
      });
      setCountries(res.data.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <>
      {!loading && 
      <div className="flex items-center justify-center shadow-md bg-white border border-gray-300 p-4">
        <div className="border rounded-lg" style={{ margin: "auto", width: "600px", height: "400px" }}>
          <VectorMap
            map={worldMill}
            containerStyle={{
              width: "700px",
              height: "600px",
            }}
            backgroundColor="#f3f4f6" 
            markerStyle={{
              initial: {
                fill: "red",
              },
            }}
            series={{
              regions: [
                {
                  scale: colorScale,
                  values: countries,
                  min: 0,
                  max: 100,
                },
              ],
            }}
            onRegionTipShow={(event, label, code) => {
              const countryData = countries[code];
              if (countryData !== null) {
                const tooltipContent = `
                  <div class="custom-tooltip">
                    <p><b>${label.html()}</b></p>
                    <p>${countryData}</p>
                  </div>
                `;
                label.html(tooltipContent);
              } else {
                event.preventDefault();  
              }
            }}
          />
        </div>
      </div>
      }
    </>
  );
}

export default MapChart;
