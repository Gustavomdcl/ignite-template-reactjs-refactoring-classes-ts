import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

const Dashboard = () => {
  const [foods,setFoods] = useState<IFood[]>([] as IFood[])
  const [editingFood,setEditingFood] = useState<IFood>({} as IFood)
  const [modalOpen,setModalOpen] = useState(false)
  const [editModalOpen,seteditModalOpen] = useState(false)
  useEffect(()=>{
    async function init() {
      const {data} = await api.get('/foods')
      setFoods(data)
    }
    init()
  },[])
  const handleAddFood = async (food:IFood) => {
    try {
      const {data} = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(currentFoods=>[...currentFoods,data])
    } catch (err) {
      console.log(err);
    }
  }
  const handleUpdateFood = async (food:IFood) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }
  const handleDeleteFood = async (id:number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }
  const toggleModal = () => {
    setModalOpen(currentModalOpen=>!currentModalOpen)
  }
  const toggleEditModal = () => {
    seteditModalOpen(setEditModalOpen=>!setEditModalOpen)
  }
  const handleEditFood = (food:IFood) => {
    setEditingFood(food)
    seteditModalOpen(true)
  }
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
