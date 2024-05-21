import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React, { useState, useEffect } from "react";
import { analyticsEndpoints } from '../../../../services/apis';
import { useSelector } from "react-redux";
import { apiConnector } from "../../../../services/apiConnector";

const { GET_TOTAL_COUNTRY_ANALYTICS_USER_API } = analyticsEndpoints;

function MapChart() {
  const { token } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState(null);
  const [loading, setLoading] = useState(false);
  const colorScale = ["#bbf7d0", "#16a34a"];

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiConnector('GET', GET_TOTAL_COUNTRY_ANALYTICS_USER_API, null, {
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
        <div className="flex items-center justify-center">
          <div className="border rounded-lg" style={{ margin: "auto", width: "600px", height: "400px" }}>
            <VectorMap
              map={worldMill}
              containerStyle={{
                width: "700px",
                height: "600px",
              }}
              backgroundColor="#e2e8f0"
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
                label.html(`
                  <div style="padding: 8px; border: 1px solid #d1d5db; background-color: #ffffff; border-radius: 5px; margin: -10px; color: #0f172a;">
                    <p style="color: #334155;"><b>${label.html()}</b></p>
                    <p>${countries[code] ? countries[code] : 0}</p>
                  </div>`);
              }}
            />
          </div>
        </div>
      }
    </>
  );
}

export default MapChart;



