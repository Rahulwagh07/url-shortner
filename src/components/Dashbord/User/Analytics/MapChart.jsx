import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React, { useState } from "react";
import { analyticsEndpoints } from '../../../../services/apis';
import { useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import { useEffect } from "react";
import { apiConnector } from "../../../../services/apiConnector";

const { GET_TOTAL_COUNTRY_ANALYTICS_USER_API } = analyticsEndpoints;

function MapChart() {
  const {token} = useSelector((state) => state.auth)
  const [countries, setCountries] = useState(null)
  const [loading, setLoading] = useState(false)
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
    <div className="border rounded-lg" style={{ margin: "auto", width: "600px", height: "500px" }}>
       {loading ? <div className="flex items-center justify-center"><Spinner/></div> : 
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
          return label.html(`
                  <div style="background-color: #ffffff; min-height: 50px; width: 125px; color:#020617;">
                    <p>
                    <b>
                    ${label.html()}
                    </b>
                    </p>
                    <p>
                    ${countries[code] ? countries[code] : 0}
                    </p>
                    </div>`);
        }}
      />
       }
    </div>
  );
}

export default MapChart;
