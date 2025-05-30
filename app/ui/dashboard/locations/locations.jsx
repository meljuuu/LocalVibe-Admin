"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./locations.module.css";
import { decryptData } from "../../../utils/encryption";

const regions = [
    { id: 'NCR', name: 'NCR - National Capital Region' },
    { id: 'CAR', name: 'CAR - Cordillera Administrative Region' },
    { id: 'I', name: 'Region I - Ilocos Region' },
    { id: 'II', name: 'Region II - Cagayan Valley' },
    { id: 'III', name: 'Region III - Central Luzon' },
    { id: 'IV-A', name: 'Region IV-A - CALABARZON' },
    { id: 'IV-B', name: 'Region IV-B - MIMAROPA' },
    { id: 'V', name: 'Region V - Bicol Region' },
    { id: 'VI', name: 'Region VI - Western Visayas' },
    { id: 'VII', name: 'Region VII - Central Visayas' },
    { id: 'VIII', name: 'Region VIII - Eastern Visayas' },
    { id: 'IX', name: 'Region IX - Zamboanga Peninsula' },
    { id: 'X', name: 'Region X - Northern Mindanao' },
    { id: 'XI', name: 'Region XI - Davao Region' },
    { id: 'XII', name: 'Region XII - SOCCSKSARGEN' },
    { id: 'XIII', name: 'Region XIII - Caraga' },
    { id: 'BARMM', name: 'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao' }
];

const cities = {
    'NCR': [
        'Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong',
        'Pasay', 'Caloocan', 'Las Piñas', 'Muntinlupa', 'Parañaque', 'Marikina',
        'Valenzuela', 'San Juan', 'Pateros', 'Malabon', 'Navotas'
    ],
    'CAR': [
        'Baguio', 'Tabuk', 'La Trinidad', 'Bangued', 'Bontoc', 'Lagawe', 'Banaue'
    ],
    'I': [
        'San Fernando', 'Laoag', 'Vigan', 'San Carlos', 'Alaminos', 'Dagupan', 'Urdaneta'
    ],
    'II': [
        'Tuguegarao', 'Ilagan', 'Santiago', 'Cauayan', 'Tuguegarao', 'Bayombong', 'Aparri'
    ],
    'III': [
        'San Fernando', 'Angeles', 'Olongapo', 'Malolos', 'Meycauayan', 'San Jose del Monte', 'Cabanatuan'
    ],
    'IV-A': [
        'Calamba', 'San Pablo', 'Santa Rosa', 'Batangas City', 'Lipa', 'San Pedro', 'Biñan'
    ],
    'IV-B': [
        'Calapan', 'Puerto Princesa', 'San Jose', 'Romblon', 'Boac', 'Mamburao', 'Coron'
    ],
    'V': [
        'Legazpi', 'Naga', 'Iriga', 'Tabaco', 'Ligao', 'Sorsogon City', 'Daet'
    ],
    'VI': [
        'Iloilo City', 'Bacolod', 'Roxas', 'San Carlos', 'Silay', 'Talisay', 'Cadiz'
    ],
    'VII': [
        'Cebu City', 'Mandaue', 'Dumaguete', 'Talisay', 'Toledo', 'Bogo', 'Carcar'
    ],
    'VIII': [
        'Tacloban', 'Ormoc', 'Calbayog', 'Baybay', 'Catbalogan', 'Maasin', 'Borongan'
    ],
    'IX': [
        'Zamboanga City', 'Dipolog', 'Pagadian', 'Isabela', 'Dapitan', 'Ipil', 'Molave'
    ],
    'X': [
        'Cagayan de Oro', 'Iligan', 'Oroquieta', 'Ozamiz', 'Tangub', 'Gingoog', 'El Salvador'
    ],
    'XI': [
        'Davao City', 'Digos', 'Tagum', 'Panabo', 'Mati', 'Samal', 'Mati'
    ],
    'XII': [
        'Koronadal', 'General Santos', 'Cotabato City', 'Kidapawan', 'Tacurong', 'Alabel', 'Surallah'
    ],
    'XIII': [
        'Butuan', 'Surigao City', 'Tandag', 'Bislig', 'Bayugan', 'Cabadbaran', 'San Francisco'
    ],
    'BARMM': [
        'Cotabato City', 'Marawi', 'Lamitan', 'Jolo', 'Isabela', 'Bongao', 'Maluso'
    ]
};

const ITEMS_PER_PAGE = 5;

const Locations = () => {
  const [users, setUsers] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('III');
  const [selectedCity, setSelectedCity] = useState('Olongapo');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching users with params:", {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          region: selectedRegion,
          city: selectedCity
        });

        const response = await fetch(
          `/api/users/locations?page=${currentPage}&limit=${ITEMS_PER_PAGE}&region=${selectedRegion}&city=${selectedCity}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received data from API:", data);
        
        if (data.users) {
          console.log("Setting users:", data.users);
          setUsers(data.users);
          setCount(data.count || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          console.log("No users found in response");
          setUsers([]);
          setCount(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setCount(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, selectedRegion, selectedCity]);

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    // Reset city to first city in the selected region
    const firstCity = cities[newRegion]?.[0] || '';
    setSelectedCity(firstCity);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Get available cities for the selected region
  const availableCities = cities[selectedRegion] || [];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Locations</h2>
      <div className={styles.filters}>
        <select 
          value={selectedRegion} 
          onChange={handleRegionChange}
          className={styles.select}
        >
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <select 
          value={selectedCity} 
          onChange={handleCityChange}
          className={styles.select}
        >
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Region</td>
            <td>City</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              const decryptedEmail = decryptData(user.email);
              const userData = {
                ...user,
                _id: user._id?.toString(),
              };
              return (
                <tr key={userData._id}>
                  <td>
                    <div className={styles.user}>
                      <Image
                        src={userData.avatar?.url || "/noavatar.png"}
                        alt=""
                        width={40}
                        height={40}
                        className={styles.userImage}
                      />
                      {userData.name}
                    </div>
                  </td>
                  <td>{decryptedEmail}</td>
                  <td>{userData.address?.region || userData.region || 'Region III - Central Luzon'}</td>
                  <td>{userData.address?.city || userData.city || 'Olongapo'}</td>
                  <td>
                    <div className={styles.buttons}>
                      <Link href={`/dashboard/users/${userData._id}`}>
                        <button className={`${styles.button} ${styles.view}`}>
                          View
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className={styles.empty}>
                No users found in {selectedCity}, {regions.find(r => r.id === selectedRegion)?.name}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.paginationInfo}>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <span>
          Showing {Math.min(currentPage * ITEMS_PER_PAGE, count)} of {count} users
        </span>
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Locations; 