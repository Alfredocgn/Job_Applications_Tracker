import { useEffect, useState } from "react";
import { URLAWS } from "./Home";
import { apiFetch } from "../utils/utils";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
}

export const Companies = () => {
  const [data, setData] = useState<Company[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [currentPage,setCurrentPage] = useState<number>(1)
  const [totalPages,setTotalPages] = useState<number>(1)

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const fetchCompanies = async (page:number) => {
    setLoading(true);

    try {
      const response = await apiFetch(`${URLAWS}/companies/?page=${page}`);
      if (response.ok) {
        const applications = await response.json();
        setData(applications.results);
        setTotalPages(Math.ceil(applications.count / 10))

      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiFetch(`${URLAWS}/companies/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData((prevData) => prevData?.filter((company) => company.id !== id));
      }
    } catch (error) {
      console.error("Error deleting application", error);
    }
  };






  const handleNextPage = () => {
    if(currentPage<totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if(currentPage > 1){
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }


  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-[1.5rem] pb-4 text-center">Companies</h1>
      <table className="mb-4">
        <thead>
          <tr>
            <th className="w-[10rem] text-center border-2">Name</th>
            <th className="w-[10rem] text-center border-2">Location</th>
            <th className="w-[10rem] text-center border-2">Industry</th>
            <th className="w-[10rem] text-center border-2">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((company) => (
              <tr key={company.id}>
                <td className="w-[10rem] text-center border-2">{company.name}</td>
                <td className="w-[10rem] text-center border-2">{company.location}</td>
                <td className="w-[10rem] text-center border-2">{company.industry}</td>
                <td className="w-[10rem] text-center border-2">

                    <div className="flex gap-2 items-center justify-center text-[1.5rem]">
                      <button onClick={() => handleDelete(company.id)}><MdOutlineDeleteOutline /></button>
                    </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No Companies added</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between w-full max-w-[500px] mt-4 ">
        <button className=" mb-2 border-2 rounded-xl px-4 py-2 inline-block " onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span className=" mb-2 border-2 rounded-xl px-4 py-2 inline-block ">Page {currentPage} of {totalPages}</span>
        <button className=" mb-2 border-2 rounded-xl px-4 py-2 inline-block " onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};
