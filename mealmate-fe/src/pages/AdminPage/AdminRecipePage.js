import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Rate,
  Image,
  message,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AddRecipeModal from "../../components/ModalComponent/AddRecipeModal";
import EditRecipeModal from "../../components/ModalComponent/EditRecipeModal";
import { api, endpoints } from "../../utils/axiosInstance";

const AdminRecipePage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.recipes.list);
      console.log("Dữ liệu API:", response);
      const formattedData = (response?.data || []).map((recipe) => ({
        ...recipe,
        key: recipe._id,
        name: recipe.name,
        tags: recipe.tags || [],
        rating: recipe.rating || 0,
        image: recipe.image,
      }));
      setRecipes(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công thức:", error);
      message.error("Không thể tải danh sách công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingRecipe(null);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    fetchRecipes();
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setEditingRecipe(null);
    fetchRecipes();
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsEditModalVisible(true);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text?.toString() || ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
    setSearchText("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(endpoints.recipes.delete(id));
      message.success("Xóa công thức thành công");
      fetchRecipes();
    } catch (error) {
      console.error("Lỗi khi xóa công thức:", error);
      message.error("Không thể xóa công thức");
    }
  };

  const handleView = (recipe) => {
    setViewRecipe(recipe);
    setIsViewModalVisible(true);
  };

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      width: "120px",
      render: (image) => (
        <Image
          src={image || "https://via.placeholder.com/150"}
          alt="Công thức"
          style={{ width: 100, height: 100, objectFit: "cover" }}
          fallback="https://via.placeholder.com/150"
        />
      ),
    },
    {
      title: "Tên Công Thức",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thẻ Tag",
      dataIndex: "tags",
      render: (tags) => (
        <span>
          {(tags || []).map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      width: "150px",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: "200px",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa Công Thức"
            description="Bạn có chắc chắn muốn xóa công thức này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Đồng Ý"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const ViewRecipeModal = ({ recipe, visible, onClose }) => {
    if (!recipe) return null;

    return (
      <Modal
        title="Chi Tiết Công Thức"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Image
              src={recipe.image || "https://via.placeholder.com/300"}
              alt={recipe.name}
              style={{ maxWidth: "300px" }}
              fallback="https://via.placeholder.com/300"
            />
          </div>

          <h2>{recipe.name}</h2>

          <div style={{ margin: "10px 0" }}>
            <Rate disabled defaultValue={recipe.rating} />
          </div>

          <div style={{ margin: "10px 0" }}>
            {(recipe.tags || []).map((tag) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>

          <div style={{ margin: "20px 0" }}>
            <h3>Mô Tả</h3>
            <p>{recipe.description}</p>
          </div>

          <div style={{ margin: "20px 0" }}>
            <h3>Nguyên Liệu</h3>
            <ul>
              {(recipe.ingredients || []).map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ margin: "20px 0" }}>
            <h3>Các Bước Thực Hiện</h3>
            <ol>
              {(recipe.steps || []).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ margin: "20px 0" }}>
            <p>
              <strong>Thời Gian Chuẩn Bị:</strong> {recipe.prep_time} phút
            </p>
            <p>
              <strong>Thời Gian Nấu:</strong> {recipe.cook_time} phút
            </p>
            <p>
              <strong>Tổng Thời Gian:</strong> {recipe.total_time} phút
            </p>
            <p>
              <strong>Khẩu Phần:</strong> {recipe.servings}
            </p>
            <p>
              <strong>Calories:</strong> {recipe.calories}
            </p>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1 style={{ margin: 0 }}>Quản Lý Công Thức</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm Công Thức
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={recipes}
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      <AddRecipeModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />

      <EditRecipeModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
        recipe={editingRecipe}
      />

      <ViewRecipeModal
        recipe={viewRecipe}
        visible={isViewModalVisible}
        onClose={() => {
          setIsViewModalVisible(false);
          setViewRecipe(null);
        }}
      />
    </div>
  );
};

export default AdminRecipePage;
