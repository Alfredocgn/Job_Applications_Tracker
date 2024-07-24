import { useEffect, useState } from "react";
import { URLAWS } from "./Home";
import { apiFetch } from "../utils/utils";
import { MdOutlineDeleteOutline, MdOutlineModeEdit, MdCheck, MdOutlineCancelPresentation } from "react-icons/md";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCompany, setEditedCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);

    try {
      const response = await apiFetch(`${URLAWS}/companies/`);
      if (response.ok) {
        const applications = await response.json();
        setData(applications.results);

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

  const handleEditClick = (company: Company) => {
    setEditingId(company.id);
    setEditedCompany(company);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedCompany(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveClick = async () => {
    if (!editedCompany || editingId === null) return;
    try {
      const response = await apiFetch(`${URLAWS}/applications/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCompany),
      });

      if (response.ok) {
        const updatedCompany = await response.json();
        setData((prevData) => prevData?.map((company) => company.id === editingId ? updatedCompany : company));
        setEditingId(null);
        setEditedCompany(null);
      } else {
        console.log('Error updating application', response.statusText);
      }
    } catch (error) {
      console.error("Error updating application", error);
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-[1.5rem] pb-4 text-center">Companies</h1>
      <table className="mb-4">
        <thead>
          <tr>
            <th className="w-[10rem] text-center border-2">Name</th>
            <th className="w-[10rem] text-center border-2">Location</th>
            <th className="w-[10rem] text-center border-2">Industry</th>
            <th className="w-[10rem] text-center border-2">
              {editingId ? "Save / Cancel" : "Edit / Delete"}
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
                  {editingId === company.id ? (
                    <div className="flex gap-2 items-center justify-center text-[1.5rem]">
                      <button onClick={handleSaveClick}><MdCheck /></button>
                      <button onClick={handleCancelClick}><MdOutlineCancelPresentation /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center justify-center text-[1.5rem]">
                      <button onClick={() => handleEditClick(company)}><MdOutlineModeEdit /></button>
                      <button onClick={() => handleDelete(company.id)}><MdOutlineDeleteOutline /></button>
                    </div>
                  )}
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
    </div>
  );
};
