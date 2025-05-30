import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Image,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";
import moment from "moment";

const { Option } = Select;

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAFBUlEQVR4nO2dW2gdRRjHf01MTYIaj7QVbWt8qRVvqPXSqiheg1gfWrRIQVtQwZdiX6xPgvgiKFj0wQcFQa0iKoKXKoq0UhXUYqsUW2ubGi1NNZeaS2PTPnzn5GzM2T17Zndnd2e/H/yhnLMz883Mf8/uzH47c8DhcDgcDofD4XA4HA6Hw+FwxEVR0gZ40A4sBjqBBcBcoA1oBKYCE4HLwDAwCJwGTgIHgX6gF/g9AZuLgJuBO4EbgdnADGA6UA2MA/4BzgHHgD+APcDPwK/A5YRszh1NwGPAV8BFIBPy+Bv4HHgYmBSj3TXAU8BW4FwEe4eAzcDDQHWMducCBjwJHCJ6IvIdvwFrgckx2D8VWA0cjMH+LPuBJ4DyGOzPHDOBD4ArJJeQq8efwBqgxmIdK4EdCdTx6rEZmGGxjqmkCXgXGCX5ZOQ7LgBvAlUW6loCHIixjlHgHaDBQj1TQwfQR/IJCHIcBm6LWN864PeY6xjk6AGujVjfxCkHXgIukXzQTY+/gOcj1LsG+CfmOgY9LgIvEP1WPzFmAz+RfJBtHT8AsyLUfxvwT8z1C3P8CMwJWf/YmQC8DoyQfGDjOEaA9UBlyDZYBpyKuW5RjhHgNaAiZBvEQjWwieSDmMSxCZgUsg1WxlyvuI6NpKw/qwTeI/ngpel4O2Q7PBNznew4CtOBz0g+aGk8tods12WW7LDrKEwz8CXJB8sGe4GbQrTvEkt22HUUpgH4nOQDZZO9wA0h2rkrZjvsOgpTB3xK8gGy0V5gXoi2/jxmO+w6ClMDfELyQbHZXmB2iPb+JGY77DoKUwW8T/KByIK9wMwQ7b4/ZjvsOgpTAbxL8gHIkr3A9SHafnvMdth1FKYM2EDyjc+iPcD1hu2/L2Y77DoKUwpsIPmGZ9UeYI5hDHbGbIddR2FKgLdIvtFZtgeYbRiH72O2w66jMMXAepJvcNbtBqYZxmJPzHbYdRSmCHiD5BubF3YD1xnG40DMdth1FOY1km9onugxjMnpmO2w6yjMyyTfyLzRYxiXizHbYddRmOdJvoF5pMcwNsMx22HXUZiVJN+4vNJjGJ+/Y7bDrqMwD5F8w/JMj2GMjsVsh11HYZYDl0i+YXnmEtBtEKeTMdth11GYhcAgyTcq7wwCCw3idSZmO+w6CtMOnCH5BhWCM0C7QczOxmyHXUdhpgH7Sb4xheI3YKpB3IZitsOuozDVwDaSb0jh2IZZr+9IzHbYdRSmEngIGCb5hhSOYeBBzB4jjMRsh11HYYqAp4HTJN+IwnMaWI35o/aRmO2w6yjMdcBXJN+AonEVsA2YbxifkZjtsOsozBzgW5IPflHZAcw1jNFIzHbYdRSmFugm+aDnhW5MJzKOxGyHXUdhyoAXgQskH+y8cAF4AbNJQSMx22HXUZgS4FngJMkHOW+cBJ7BbCWXkZjtsOsoTDHwOHCM5IObd44BjxF+1ZSRmO2w6yhMEbAM2EXygS4Ku4GlhFsXaiRmO+w6CtMFfEPyAS4q3wKLQ8TQZH0tu47CLCb8+6UOc/YDd4WIo8n6WnYdhZkPfEjyAS06I8CHwLwQsTRZX8uuozAtwBvAeZIPZtE5D7wONIeIp8n6WnYdhakHVgGHSD6IReUQsBKoCxFXk/W17DoKUwncD2wBzpF8MPPOOeALYDnmr7uZrK9l11GYSmAJ8D6wj+SDmjf2Au8BS4n2IpTJ+lp2HYWpBhYBzwFfk40XoE4AW4HngYWYvwHrh8n6WnYdhakCOoEOoA2YgZnvDofD4XA4HA6Hw+FwOBwOh8PhyAv/AUJGqV8CzrtRAAAAAElFTkSuQmCC";

const AdminMenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);

  // Fetch recipe details by ID
  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await api.get(endpoints.recipes.detail(recipeId));
      return response;
    } catch (error) {
      console.error(`Error fetching recipe details for ID ${recipeId}:`, error);
      return null;
    }
  };

  // Fetch menus with populated recipe details
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const menusResponse = await api.get(endpoints.menus.list);
      const menusData = menusResponse.data || [];

      // Process each menu and its recipes
      const menusWithRecipes = await Promise.all(
        menusData.map(async (menu) => {
          // Get recipe details for each recipe in the menu
          const recipesWithDetails = await Promise.all(
            (menu.recipes || []).map(async (recipeItem) => {
              try {
                // Extract recipe ID correctly from the nested structure
                let recipeId;
                if (
                  typeof recipeItem.recipe === "object" &&
                  recipeItem.recipe
                ) {
                  recipeId = recipeItem.recipe._id;
                } else {
                  recipeId = recipeItem.recipe;
                }

                if (!recipeId) {
                  console.error("No recipe ID found in:", recipeItem);
                  return null;
                }

                // Fetch complete recipe details
                const recipeDetails = await fetchRecipeDetails(recipeId);

                if (!recipeDetails) {
                  console.error(
                    "Failed to fetch recipe details for ID:",
                    recipeId
                  );
                  return null;
                }

                return {
                  ...recipeDetails,
                  _id: recipeId,
                  servings: recipeItem.servings || 1,
                  image: recipeDetails.image || DEFAULT_IMAGE,
                };
              } catch (error) {
                console.error("Error processing recipe:", error);
                return null;
              }
            })
          );

          // Filter out failed recipes and format menu data
          const validRecipes = recipesWithDetails
            .filter((recipe) => recipe !== null)
            .map((recipe) => ({
              _id: recipe._id,
              name: recipe.name || "Unnamed Recipe",
              image: recipe.image || DEFAULT_IMAGE,
              description: recipe.description || "",
              servings: recipe.servings || 1,
              tags: recipe.tags || [],
            }));

          return {
            ...menu,
            key: menu._id,
            recipes: validRecipes,
          };
        })
      );

      setMenus(menusWithRecipes);
    } catch (error) {
      console.error("Error fetching menus:", error);
      message.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes for the add/edit form
  const fetchRecipes = async () => {
    try {
      const response = await api.get(endpoints.recipes.list);
      setRecipes(response.data || []);
    } catch (error) {
      message.error("Failed to fetch recipes");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    const getAllUniqueTags = () => {
      const allTags = menus.reduce((tags, menu) => {
        if (menu.tags && Array.isArray(menu.tags)) {
          return [...tags, ...menu.tags];
        }
        return tags;
      }, []);

      // Lọc các tag trùng nhau và sắp xếp theo alphabet
      const uniqueTags = [...new Set(allTags)].sort();

      // Chuyển đổi thành format filter của antd
      const filters = uniqueTags.map((tag) => ({
        text: tag,
        value: tag,
      }));

      setTagFilters(filters);
    };

    getAllUniqueTags();
  }, [menus]);

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      const newTags = [...tags, inputTag];
      setTags(newTags);
      form.setFieldValue("tags", newTags);
      setInputTag("");
    }
  };

  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    form.setFieldValue("tags", newTags);
  };

  const showModal = (menu = null) => {
    if (menu) {
      setIsEditMode(true);
      setCurrentMenu(menu);
      setTags(menu.tags || []);
      form.setFieldsValue({
        ...menu,
        type: menu.type || "breakfast",
        serves: menu.serves || 1,
        tags: menu.tags || [],
        recipes: menu.recipes.map((r) => r._id),
      });
    } else {
      setIsEditMode(false);
      setCurrentMenu(null);
      setTags([]);
      form.resetFields();
    }
    setIsModalVisible(true);
    fetchRecipes();
  };

  const showViewModal = (menu) => {
    setCurrentMenu(menu);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTags([]);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentMenu(null);
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        name: values.name,
        description: values.description,
        type: values.type || "breakfast",
        serves: parseInt(values.serves) || 1,
        tags: values.tags || [],
        recipes: (values.recipes || []).map((recipeId) => ({
          recipe: recipeId,
          servings: 1,
        })),
      };

      let response;
      if (isEditMode && currentMenu?._id) {
        response = await api.put(
          endpoints.menus.update(currentMenu._id),
          formattedValues
        );
        if (response.data) {
          message.success("Cập nhật thực đơn thành công");
        }
      } else {
        console.log("Creating new menu");
        response = await api.post(endpoints.menus.create, formattedValues);
        if (response.data) {
          message.success("Tạo thực đơn thành công");
        }
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchMenus();
    } catch (error) {
      console.error("Lỗi khi lưu thực đơn:", error);
      console.error("Chi tiết lỗi:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(
          "Không thể lưu thực đơn. Vui lòng kiểm tra lại thông tin!"
        );
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(endpoints.menus.delete(id));
      message.success("Menu deleted successfully");
      fetchMenus();
    } catch (error) {
      message.error("Failed to delete menu");
    }
  };

  // Add search handling functions
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
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
        <Space>
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (!value || !record[dataIndex]) {
        return false;
      }

      // Chuyển đổi cả hai chuỗi thành chữ thường và bỏ dấu để so sánh
      const normalizeStr = (str) => {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");
      };

      const recordValue = normalizeStr(record[dataIndex].toString());
      const searchValue = normalizeStr(value);

      // Tách từ khóa tìm kiếm thành các từ riêng lẻ
      const searchTerms = searchValue.split(/\s+/).filter((term) => term);

      // Kiểm tra xem tất cả các từ tìm kiếm có xuất hiện trong giá trị không
      return searchTerms.every((term) => recordValue.includes(term));
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={searchText ? searchText.split(/\s+/) : []}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "150px",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: "200px",
      ...getColumnSearchProps("description"),
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {searchedColumn === "description" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: "120px",
      filters: [
        { text: "Bữa sáng", value: "breakfast" },
        { text: "Bữa trưa", value: "lunch" },
        { text: "Bữa tối", value: "dinner" },
        { text: "Ăn vặt", value: "snack" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag
          color={
            type === "breakfast"
              ? "blue"
              : type === "lunch"
              ? "green"
              : type === "dinner"
              ? "purple"
              : "orange"
          }
        >
          {type === "breakfast"
            ? "Bữa sáng"
            : type === "lunch"
            ? "Bữa trưa"
            : type === "dinner"
            ? "Bữa tối"
            : "Ăn vặt"}
        </Tag>
      ),
    },
    {
      title: "Số Người",
      dataIndex: "serves",
      key: "serves",
      width: "100px",
      align: "center",
      sorter: {
        compare: (a, b) => a.serves - b.serves,
        multiple: 1,
      },
      render: (serves) => <div style={{ textAlign: "center" }}>{serves}</div>,
    },
    {
      title: "Thẻ",
      dataIndex: "tags",
      key: "tags",
      width: "200px",
      filters: tagFilters,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.tags && record.tags.includes(value);
      },
      render: (tags) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {(tags || []).map((tag) => (
            <Tag color="blue" key={tag} style={{ margin: "2px" }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Công Thức",
      dataIndex: "recipes",
      key: "recipes",
      width: "300px",
      render: (recipes) => (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {(recipes || []).map((recipe) => (
            <div
              key={recipe._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                padding: "8px",
                background: "#f5f5f5",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#e8e8e8",
                }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  {recipe.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Khẩu phần: {recipe.servings}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      fixed: "right",
      width: "120px",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
              size="small"
            >
              Xem
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
            >
              Sửa
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Popconfirm
              title="Xóa thực đơn"
              description="Bạn có chắc chắn muốn xóa thực đơn này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  const ViewRecipeModal = ({ menu, visible, onCancel }) => {
    if (!menu) return null;

    return (
      <Modal
        title={`Menu Details - ${menu.name}`}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 20 }}>
          <p>
            <strong>Date:</strong> {moment(menu.date).format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>Description:</strong> {menu.description}
          </p>
        </div>

        <h3>Recipes in this menu:</h3>
        <Row gutter={[16, 16]}>
          {menu.recipes.map((recipe) => (
            <Col span={12} key={recipe._id}>
              <Card size="small">
                <div
                  style={{ display: "flex", alignItems: "start", gap: "16px" }}
                >
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                    fallback={DEFAULT_IMAGE}
                  />
                  <div>
                    <h4>{recipe.name}</h4>
                    <p>Servings: {recipe.servings}</p>
                    <div>
                      {recipe.tags?.map((tag) => (
                        <Tag color="blue" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Quản Lý Thực Đơn</h1>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Xóa các thực đơn đã chọn"
              description="Bạn có chắc chắn muốn xóa các thực đơn đã chọn?"
              onConfirm={() => {
                // Add function to handle bulk delete
                message.success("Đã xóa các thực đơn đã chọn");
                setSelectedRowKeys([]);
              }}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button danger>Xóa {selectedRowKeys.length} thực đơn</Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Thêm Thực Đơn
          </Button>
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={menus}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
        }}
        scroll={{ x: 1500 }}
        onChange={(pagination, filters, sorter) => {
          console.log("Table change:", { pagination, filters, sorter });
        }}
      />

      <Modal
        title={isEditMode ? "Sửa Thực Đơn" : "Tạo Thực Đơn Mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={form.submit}
        width={800}
        okText={isEditMode ? "Cập Nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ serves: 1, type: "breakfast" }}
        >
          <Form.Item
            name="name"
            label="Tên Thực Đơn"
            rules={[{ required: true, message: "Vui lòng nhập tên thực đơn" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại Bữa Ăn"
            rules={[{ required: true, message: "Vui lòng chọn loại bữa ăn" }]}
          >
            <Select>
              <Option value="breakfast">Bữa sáng</Option>
              <Option value="lunch">Bữa trưa</Option>
              <Option value="dinner">Bữa tối</Option>
              <Option value="snack">Ăn vặt</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="serves"
            label="Số Người Ăn"
            rules={[
              { required: true, message: "Vui lòng nhập số người ăn" },
              {
                validator: async (_, value) => {
                  const numValue = parseInt(value);
                  if (isNaN(numValue)) {
                    throw new Error("Vui lòng nhập một số hợp lệ");
                  }
                  if (numValue < 1) {
                    throw new Error("Số người ăn phải từ 1 trở lên");
                  }
                },
              },
            ]}
            validateFirst={true}
          >
            <Input
              type="number"
              min={1}
              onChange={(e) => {
                const value = e.target.value;
                if (value && parseInt(value) >= 1) {
                  form.setFieldsValue({ serves: parseInt(value) });
                }
              }}
            />
          </Form.Item>

          <Form.Item name="tags" label="Thẻ">
            <div>
              <Space style={{ marginBottom: "8px" }}>
                <Input
                  placeholder="Nhập thẻ"
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  onPressEnter={handleAddTag}
                  style={{ width: 200 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddTag}
                >
                  Thêm Thẻ
                </Button>
              </Space>
              <div style={{ marginTop: "8px" }}>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                    style={{ marginBottom: "8px" }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="recipes"
            label="Công Thức"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một công thức",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn công thức"
              style={{ width: "100%" }}
              optionFilterProp="children"
            >
              {recipes.map((recipe) => (
                <Option key={recipe._id} value={recipe._id}>
                  {recipe.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ViewRecipeModal
        menu={currentMenu}
        visible={isViewModalVisible}
        onCancel={handleViewCancel}
      />
    </div>
  );
};

export default AdminMenuPage;
